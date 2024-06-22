'use strict';

{
  // container
  const container = document.querySelector('ocr-container') || document.createElement('ocr-container');
  if (container.isConnected === false) {
    document.body.append(container);
  }

  const em = document.createElement('ocr-result');
  em.dataset.page = chrome.runtime.getManifest().homepage_url + '#faq8';
  container.append(em);

  const command = em.command = /Firefox/.test(navigator.userAgent) ? (name, ...args) => {
    em.setAttribute('command', JSON.stringify({name, args}));
    em.dispatchEvent(new Event('command'));
  } : (name, ...args) => em[name](...args);

  const ocr = (lang, src) => {
    const report = report => {
      command('message', report.status);

      if (report.status === 'recognizing text') {
        command('progress', report.progress);
      }
      else if (
        report.status === 'loading language traineddata' ||
        report.status === 'loaded language traineddata'
      ) {
        command('progress', report.progress, 'lang');
      }
    };
    const controller = new AbortController();
    em.addEventListener('closed', () => controller.abort());
    return self.execute({
      lang,
      src,
      accuracy: em.dataset.accuracy,
      signal: controller.signal
    }, report);
  };

  // if there is oResult object, run in inverted colors
  const run = em.run = async (oResult, mode = 'normal') => {
    const src = await self.crop(em.href, em.box, mode);

    command('progress', 0);
    command('clear');

    const lang = oResult?.lang || em.dataset.language || 'eng';

    let o;
    try {
      if (lang !== 'detect') {
        o = await ocr(lang, src);
      }
      else {
        await Promise.all([
          ocr('eng', src).then(o => {
            return new Promise(resolve => chrome.i18n.detectLanguage(o.text, r => {
              resolve({
                lang: 'eng',
                o,
                r
              });
            }));
          }),
          ocr('ara', src).then(o => {
            return new Promise(resolve => chrome.i18n.detectLanguage(o.text, r => {
              resolve({
                lang: 'ara',
                o,
                r
              });
            }));
          }),
          ocr('jpn', src).then(o => {
            return new Promise(resolve => chrome.i18n.detectLanguage(o.text, r => {
              resolve({
                lang: 'jpn',
                o,
                r
              });
            }));
          })
        ]).then(async a => {
          const r = a.sort((a, b) => {
            return b.o.confidence - a.o.confidence;
          })[0];
          if (r.r.languages.length) {
            const ln = r.r.languages[0].language;

            const e = r.lang.startsWith(ln) ? r.lang : em.dataset.languages.split(', ').filter(s => s.startsWith(ln)).shift();

            if (e) {
              if (a.some(o => o.lang === e)) {
                o = a.filter(o => o.lang === e).shift().o;
              }
              else {
                o = await ocr(e, src);
              }
              o.lang = e;
            }
            command('rename', `Auto Detect (${e || r.lang})`);
            command('message', `Detected language is "${e || r.lang}". Please wait...`);
          }
          o = o || r.o;
        });
      }
      command('progress', 1);

      // in case "confidence" is not acceptable, rerun with inverted colors
      if (o.confidence < 50 && !oResult) {
        command('message', `Low confidence (${o.confidence}%). Trying with inverted colors. Please wait...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        run(o, 'invert');
        return;
      }
      if (mode === 'invert' && o.confidence < 20 && oResult.confidence < 20) {
        command('message', `Low confidence (${o.confidence}%) again! Trying with inverted colors. Please wait...`);

        run(o, 'gray');
        return;
      }
      if (oResult) {
        if (oResult.confidence > o.confidence) {
          o = oResult;
        }
      }

      if (o.text.trim() === '') {
        command('build', '<span style="color: red">No text was detected! Edit the image and drop it here to retry!</span>');
      }
      else {
        command('build', o.hocr);
        command('enable');
      }
    }
    catch (e) {
      console.warn(e);
      command('message', e.message || e);
    }
  };

  // events
  em.addEventListener('open-link', e => chrome.runtime.sendMessage({
    method: 'open-link',
    href: e.detail
  }));
  em.addEventListener('fetch-resource', async e => {
    const {href, options} = e.detail;
    const t = (msg, timeout = 3000) => command('toast', 'post', {
      new: msg,
      old: 'Post Result'
    }, timeout);

    try {
      const r = await fetch(href, options);
      if (r.ok || r.status === 0) {
        t('Done');
      }
      else {
        throw Error('Error ' + r.status);
      }
    }
    catch (e) {
      console.warn(e);
      t(e.message);
    }
  });
  em.addEventListener('language-changed', () => run());
  em.addEventListener('accuracy-changed', () => {
    chrome.runtime.sendMessage({
      method: 'remove-indexeddb'
    }, run);
  });
  em.addEventListener('save-preference', e => {
    chrome.storage.local.set(e.detail);
  });
  em.addEventListener('closed', e => {
    if (e.metaKey || e.ctrlKey) {
      chrome.runtime.sendMessage({
        method: 'remove-indexeddb'
      });
    }
    if (e.shiftKey) {
      for (const e of document.querySelectorAll('ocr-result')) {
        e.remove();
      }
    }
    if (!document.querySelector('ocr-result')) {
      container.remove();
    }
  });

  // Drag and drop support
  em.addEventListener('dragover', e => {
    const types = [...e.dataTransfer.items].map(e => e.type);
    if (types.some(s => s.startsWith('image/'))) {
      e.preventDefault();
    }
  });
  em.addEventListener('drop', e => {
    const entry = [...e.dataTransfer.files].filter(e => e.type && e.type.startsWith('image/')).shift();
    if (entry) {
      e.preventDefault();
      const reader = new FileReader();
      reader.onload = () => {
        em.href = reader.result;
        em.box = {
          left: 0,
          top: 0,
          width: 0,
          height: 0
        };
        em.run();
      };
      reader.readAsDataURL(entry);
    }
  });
}
