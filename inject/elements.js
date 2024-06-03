

{
    if (customElements.get('ocr-container') === undefined) {
        // This document requires 'TrustedHTML' assignment
        self.trustedTypes?.createPolicy('default', {
            createHTML(s) {
                return s;
            }
        });

        class OCRContainer extends HTMLElement {
            constructor() {
                super();

                const shadow = this.attachShadow({ mode: 'open' });
                shadow.innerHTML = `
          <style>
            #body {
              position: fixed;
              top: 10px;
              right: 30px;
              /* padding: 5px; */
              z-index: 10000000000;
              /* box-shadow: 0 0 2px #ccc; */
              display: flex;
              gap: 5px;
              flex-direction: column;
              background-color: transparent;
              max-height: calc(100vh - 20px);
              color-scheme: light;
              overflow: auto;
            }
          </style>
          <div id="body">
            <slot></slot>
          </div>
        `;
            }
        }
        customElements.define('ocr-container', OCRContainer);
    }

    if (customElements.get('ocr-result') === undefined) {
        class OCRResult extends HTMLElement {
            constructor() {
                super();

                this.prefs = {
                    'post-method': 'POST',
                    'post-href': '',
                    'post-body': '',
                    'lang': 'eng',
                    'frequently-used': ['eng', 'fra', 'deu', 'rus', 'ara'],

                    'example': 'NA',
                    'href': 'NA'
                };

                this.locales = {
                    post: `Post/GET/PUT the result to a server.

Use Shift + Click to change the server data`,
                    close: `Close this result.

Use Shift + Click to close all results.
Use Ctrl + Click or Command + Click to remove local language training data`,
                    tutorial: `Where do you want the data to get posted:
  Server Example:
  &page;

  Post Example:
  POST|http://127.0.0.1:8080|&content;
  POST|http://127.0.0.1:8080|{"body":"&content;"}

  Put Example:
  PUT|http://127.0.0.1:8080|&content;

  Get Example:
  GET|http://127.0.0.1:8080?data=&content;|

  Open in Browser Tab Example:
  OPEN|http://127.0.0.1:8080?data=&content;|`
                };

                this.locales = {
                    post: '',
                    close: '',
                    tutorial: ''
                }

                const shadow = this.attachShadow({ mode: 'open' });
                shadow.innerHTML = `
          <style>
            :host {
              --fg: #031b30;
              --bg: #0d1117;
              --bg-inputs: #b99b3f;
              --bg-select: #0d1117;
              --bg-result: #ffffff;
              --bg-inputs-hover: #fb036a;
              --accent: #3fa5b9;
              --border-color: rgb(75, 85, 99);
              --width: 400px;
              --height: 300px;
              --gap: 10px;
            }
            :host([data-mode='expand']) {
              --height: 70vh;
            }
            #body {
              font-size: 15px;
              font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
              padding: 20px;
              display: flex;
              flex-direction: column;
              height: var(--height);
              width: min(var(--width), calc(100vw, 2rem));
              color: var(--fg);
              background-color: var(--bg);
              color-scheme: light;
              accent-color: var(--accent);
              border-radius: 10px;
            }
            progress {
              width: 100%;
            }
            img {
              display: none;
            }
            button,
            input[type=submit],
            input[type=button],
            select {
              appearance: none;
              padding: 10px;
              padding-inline-end: 20px;
              padding-inline-start: 20px;
              border-radius: 8px;
              color: var(--fg);
              background-color: var(--bg-inputs);
              border: solid 0.8px var(--border-color);
              cursor: pointer;
              font-size: inherit;
              font-weight: 500;
              box-sizing: border-box;
            }
            select {
              background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E");
              background-repeat: no-repeat;
              background-position-x: calc(100% - 8px);
              background-position-y: 50%;
              background-size: 21px 21px;
            }
            select option, select optgroup {
              background-color: var(--bg-select);
              color: grey;
            }
            input[type=button]:disabled {
              opacity: 0.5;
            }

            select:hover, input:hover, button:hover {
              background-color: var(--bg-inputs-hover);
            }
            select:focus, input:focus, button:focus {
              --tw-shadow: 0 0 #0000;
              --tw-ring-inset: var(--tw-empty,/*!*/ /*!*/);
              --tw-ring-offset-width: 0px;
              --tw-ring-offset-color: #fff;
              --tw-ring-color: var(--bg-inputs);
              --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
              --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);
              border-color: var(--accent);
              box-shadow: var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow);
              outline: 2px solid transparent;
              outline-offset: 2px;
            }
            #result, #result-in-process {
              min-height: 40px;
              background-color: var(--bg-result);
              margin: 0 0 20px 0;
              overflow: auto;
              flex: 1;
              padding: var(--gap);
              border-radius: 8px;
            }
            #result:empty::before {
              content: attr(data-msg);
            }
            #result .ocr_par:first-child {
              margin-top: 0;
            }
            #result .ocr_par:last-child {
              margin-bottom: 0;
            }
            .ocr_line {
              display: block;
            }
            .grid {
              display: grid;
              grid-template-columns: min-content 1fr;
              white-space: nowrap;
              align-items: center;
              justify-items: left;
              grid-gap: var(--gap);
            }
            .options {
              display: grid;
              grid-template-columns: 1fr 1px 1fr;
              grid-gap: var(--gap);
              background: rgba(0, 0, 0, 0.05);
              margin-bottom: var(--gap);
              margin-left: -3px;
              align-items: center;
            }
            /*
            #accuracy,
            #language {
              border: none;
              text-overflow: ellipsis;
              background-color: transparent;
              outline: none;
              padding: calc(var(--gap) / 2) 0;
              color: var(--fg);
            }
            */
            .sep {
              background-color:#b79e9a;
              height: 15px;
            }
            #tools_ {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              grid-gap: var(--gap);
              justify-content: end;
            }
            #tools {
              display: flex;
              gap: var(--gap);
              justify-content: space-between;
            }
            #tools .tool-buttons {
              display: flex;
              gap: var(--gap);
              color: ;
            }
            #result-in-process {
              display: flex;
              justify-content: center;
              flex-direction: column;
              align-items: center;
            }
            .spinner {
              color: rgb(75, 85, 99);
              fill: #d61f69;
              animation: spin 1s linear infinite;
              width: 50px;
              height: 50px;
              display: inline-block;
            }
             .language_select option:hover {
                background-color: lime !important;
            }
            .card {
  max-width: 33rem;
  background: #fff;
  margin: 0 1rem;
  padding: 1rem;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  width: 100%;
  border-radius: 0.5rem;
}
 
.star {
  font-size: 3vh;
  cursor: pointer;
    color: #222c3b;
}
  
.chose_star {
  color: rgb(255, 255, 0);
}
.rate_title_block {
    font-size: 2.5vh;
    vertical-align: text-bottom;
}
.rate_title {
    font-size: 1.5vh;
    color: #dcdce6;
}
.rate_block {
    text-align: center;
}
            @keyframes spin {
              0% {
                transform: rotate(0deg);
              }
              100% {
                transform: rotate(360deg);
              }
            }
          </style>

          <div id="body">
            <div style="display: flex; justify-content: center;">
              <img id="img">
            </div>
            <div class="options" style="display:none;">
              <span class="sep"></span>
              <select id="accuracy_" style="display:none;">
                <option value='3.02'>Low Accuracy</option>
                <option value='4.0.0_fast'>Moderate Accuracy</option>
                <option value='4.0.0'>Better Accuracy</option>
                <option value='4.0.0_best'>Best Accuracy</option>
              </select>
              <input id="accuracy" type="hidden" value="">
            </div>
            <div class="grid" style="display:none;">
              <span>Downloading</span>
              <progress id="lang" value="0" max="1"></progress>
              <span>Recognizing</span>
              <progress id="recognize" value="0" max="1"></progress>
            </div>

            <div id="result" data-msg="Please wait..." style="display:none;"></div>
            <div id="result-in-process">
              <svg aria-hidden="true" class="spinner" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
            </div>
            <div id="tools">
              <select id="language" class="language_select">
                <optgroup>
                  <option value="detect">Auto-Detect (beta)</option>
                </optgroup>
                <optgroup id="frequently-used"></optgroup>
                <optgroup>
                    <option value="Afr">Afrikaans</option>
                    <option value="Amh">Amharic</option>
                    <option value="Ara">Arabic</option>
                    <option value="Asm">Assamese</option>
                    <option value="Aze">Azerbaijani</option>
                    <option value="Aze_Cyrl">Azerbaijani - Cyrillic</option>
                    <option value="Ael">Belarusian</option>
                    <option value="Ben">Bengali</option>
                    <option value="Bod">Tibetan</option>
                    <option value="Bos">Bosnian</option>
                    <option value="Bul">Bulgarian</option>
                    <option value="Cat">Catalan; Valencian</option>
                    <option value="Ceb">Cebuano</option>
                    <option value="Ces">Czech</option>
                    <option value="Chi_Sim">Chinese - Simplified</option>
                    <option value="Chi_Tra">Chinese - Traditional</option>
                    <option value="Chr">Cherokee</option>
                    <option value="Cym">Welsh</option>
                    <option value="Dan">Danish</option>
                    <option value="Deu">German</option>
                    <option value="Dzo">Dzongkha</option>
                    <option value="Ell">Greek, Modern (1453-)</option>
                    <option value="Enm">English, Middle (1100-1500)</option>
                    <option value="Eng">English</option>
                    <option value="Epo">Esperanto</option>
                    <option value="Est">Estonian</option>
                    <option value="Eus">Basque</option>
                    <option value="Fas">Persian</option>
                    <option value="Fra">French</option>
                    <option value="Fin">Finnish</option>
                    <option value="Frk">German Fraktur</option>
                    <option value="Frm">French, Middle (ca. 1400-1600)</option>
                    <option value="Gle">Irish</option>
                    <option value="Glg">Galician</option>
                    <option value="Grc">Greek, Ancient (-1453)</option>
                    <option value="Guj">Gujarati</option>
                    <option value="Hat">Haitian; Haitian Creole</option>
                    <option value="Heb">Hebrew</option>
                    <option value="Hin">Hindi</option>
                    <option value="Hrv">Croatian</option>
                    <option value="Hun">Hungarian</option>
                    <option value="Iku">Inuktitut</option>
                    <option value="Ind">Indonesian</option>
                    <option value="Isl">Icelandic</option>
                    <option value="Ita">Italian</option>
                    <option value="Ita_Old">Italian - Old</option>
                    <option value="Jav">Javanese</option>
                    <option value="Jpn">Japanese</option>
                    <option value="Jpn_Vert">Japanese - Vertical</option>
                    <option value="Kan">Kannada</option>
                    <option value="Kat">Georgian</option>
                    <option value="Kat_Old">Georgian - Old</option>
                    <option value="Kaz">Kazakh</option>
                    <option value="Khm">Central Khmer</option>
                    <option value="Kir">Kirghiz; Kyrgyz</option>
                    <option value="Kor">Korean</option>
                    <option value="Kur">Kurdish</option>
                    <option value="Lao">Lao</option>
                    <option value="Lat">Latin</option>
                    <option value="Lav">Latvian</option>
                    <option value="Lit">Lithuanian</option>
                    <option value="Mal">Malayalam</option>
                    <option value="Mar">Marathi</option>
                    <option value="Mkd">Macedonian</option>
                    <option value="Mlt">Maltese</option>
                    <option value="Msa">Malay</option>
                    <option value="Mya">Burmese</option>
                    <option value="Nep">Nepali</option>
                    <option value="Nld">Dutch; Flemish</option>
                    <option value="Nor">Norwegian</option>
                    <option value="Ori">Oriya</option>
                    <option value="Pan">Panjabi; Punjabi</option>
                    <option value="Pol">Polish</option>
                    <option value="Por">Portuguese</option>
                    <option value="Pus">Pushto; Pashto</option>
                    <option value="Ron">Romanian; Moldavian; Moldovan</option>
                    <option value="Rus">Russian</option>
                    <option value="San">Sanskrit</option>
                    <option value="Sin">Sinhala; Sinhalese</option>
                    <option value="Slk">Slovak</option>
                    <option value="Slv">Slovenian</option>
                    <option value="Spa">Spanish; Castilian</option>
                    <option value="Spa_Old">Spanish; Castilian - Old</option>
                    <option value="Sqi">Albanian</option>
                    <option value="Srp">Serbian</option>
                    <option value="Srp_Latn">Serbian - Latin</option>
                    <option value="Swa">Swahili</option>
                    <option value="Swe">Swedish</option>
                    <option value="Syr">Syriac</option>
                    <option value="Tam">Tamil</option>
                    <option value="Tel">Telugu</option>
                    <option value="Tgk">Tajik</option>
                    <option value="Tgl">Tagalog</option>
                    <option value="Tha">Thai</option>
                    <option value="Tir">Tigrinya</option>
                    <option value="Tur">Turkish</option>
                    <option value="Uig">Uighur; Uyghur</option>
                    <option value="Ukr">Ukrainian</option>
                    <option value="Urd">Urdu</option>
                    <option value="Uzb">Uzbek</option>
                    <option value="Uzb_Cyrl">Uzbek - Cyrillic</option>
                    <option value="Vie">Vietnamese</option>
                    <option value="Yid">Yiddish</option>
                </optgroup>
              </select>

              <div class="tool-buttons">
                <button id="expand" style="display:none;">Expand</button>
                <button id="post" disabled title="${this.locales.post}"  style="display:none;">Post Result</button>
                
                <button id="copy" disabled style="width: 100px;">Copy Text</button>
                <button id="close" title="${this.locales.close}"><i class="fa fa-close"></i>Close</button>
              </div>

            </div>
                          

              
          </div>
        `;
                this.events = {};
            }
            /* io */
            configure(prefs, report = false) {
                Object.assign(this.prefs, prefs);
                if (report) {
                    this.dispatchEvent(new CustomEvent('save-preference', {
                        detail: prefs
                    }));
                }
            }
            
            prepare() {
                
                for (const lang of this.prefs['frequently-used']) {
                    const e = this.shadowRoot.querySelector(`option[value="${lang}"]`).cloneNode(true);
                    this.shadowRoot.getElementById('frequently-used').appendChild(e);
                }
               
                this.language(this.prefs.lang);
                
                this.accuracy(this.prefs.accuracy);
            }
            build(html) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                this.clear();

                for (const child of [...doc.body.childNodes]) {
                    this.shadowRoot.getElementById('result').append(child);
                }

                // automatically copy to clipboard
                setTimeout(async () => {
                    try {
                        await navigator.clipboard.writeText(this.result);
                    }
                    catch (e) {
                        const input = document.createElement('textarea');
                        input.value = this.result;
                        input.style.position = 'absolute';
                        input.style.left = '-9999px';
                        document.body.append(input);
                        input.select();
                        document.execCommand('copy');
                        input.remove();
                    }

                }, 10);
            }
            message(value) {
                this.shadowRoot.getElementById('result').dataset.msg = value;
            }
            progress(value, type = 'recognize') {
                this.shadowRoot.getElementById(type).value = value;
            }
            rename(value) {
                this.shadowRoot.querySelector('option[value=detect]').textContent = value;
            }
            clear() {
                this.shadowRoot.getElementById('result').removeAttribute('contenteditable');
                this.shadowRoot.getElementById('result').textContent = '';
                this.shadowRoot.getElementById('result').style.display = 'none';
                this.shadowRoot.getElementById('result-in-process').style.display = 'flex';
            }
            enable() {
                this.shadowRoot.getElementById('copy').disabled = false;
                this.shadowRoot.getElementById('post').disabled = false;
                this.shadowRoot.getElementById('result').setAttribute('contenteditable', true);
                this.shadowRoot.getElementById('result').style.display = 'block';
                this.shadowRoot.getElementById('result-in-process').style.display = 'none';
            }
            get result() {
                return this.shadowRoot.getElementById('result').innerText;
            }
            language(value) {
                this.dataset.language = value;
                this.shadowRoot.getElementById('language').value = value;
            }
            accuracy(value) {
                this.dataset.accuracy = value;
                this.shadowRoot.getElementById('accuracy').value = value;
            }
            toast(name, messages, timeout = 2000) {
                const elm = this.shadowRoot.getElementById(name);
                elm.value = messages.new;
                if (elm.tagName === 'BUTTON') {
                    elm.innerHTML = messages.new;
                }
                clearTimeout(this[name + 'ID']);
                this[name + 'ID'] = setTimeout(() => {
                    elm.value = messages.old;
                    if (elm.tagName === 'BUTTON') {
                        elm.innerHTML = messages.old;
                    }
                }, timeout);
            }
            connectedCallback() {
                // copy
                this.shadowRoot.getElementById('copy').onclick = async () => {
                    try {
                        await navigator.clipboard.writeText(this.result);
                    }
                    catch (e) {
                        const input = document.createElement('textarea');
                        input.value = this.result;
                        input.style.position = 'absolute';
                        input.style.left = '-9999px';
                        document.body.append(input);
                        input.select();
                        document.execCommand('copy');
                        input.remove();
                    }
                    this.toast('copy', {
                        new: 'Done',
                        old: 'Copy Text'
                    });
                };
                // post
                this.shadowRoot.getElementById('post').onclick = e => {
                    if (this.prefs['post-href'] === '' || e.shiftKey) {
                        const message = this.locales.tutorial.replace('&page;', this.dataset.page);
                        const m = prompt(
                            message,
                            [this.prefs['post-method'], this.prefs['post-href'], this.prefs['post-body']].join('|')
                        );
                        const [method, href, body] = (m || '').split('|');

                        const prefs = {
                            'post-method': (method || 'POST').toUpperCase(),
                            'post-href': href || '',
                            'post-body': body || ''
                        };
                        this.configure(prefs, true);
                    }

                    const value = this.result.trim();
                    const options = {
                        method: this.prefs['post-method'],
                        mode: 'no-cors'
                    };
                    if (this.prefs['post-body'] && this.prefs['post-method'] !== 'GET') {
                        options.body = this.prefs['post-body']
                            .replaceAll('&content;', value)
                            .replaceAll('&href;', location.href);
                        // If this is a JSON, try builder
                        if (this.prefs['post-body'].startsWith('{') && this.prefs['post-body'].endsWith('}')) {
                            try {
                                const o = JSON.parse(this.prefs['post-body']);
                                for (const [key, holder] of Object.entries(o)) {
                                    if (typeof holder === 'string') {
                                        o[key] = holder
                                            .replaceAll('&content;', value)
                                            .replaceAll('&href;', location.href);
                                    }
                                }
                                options.body = JSON.stringify(o);
                            }
                            catch (e) {
                                console.warn('Cannot use the JSON Builder', e);
                            }
                        }
                    }

                    const t = (msg, timeout = 3000) => this.toast('post', {
                        new: msg,
                        old: 'Post Result'
                    }, timeout);

                    if (this.prefs['post-href'] === '') {
                        return t('Empty Server');
                    }

                    t('...', 1000000);

                    const href = this.prefs['post-href']
                        .replaceAll('&content;', encodeURIComponent(value))
                        .replaceAll('&href;', encodeURIComponent(location.href));

                    if (options.method === 'OPEN') {
                        this.dispatchEvent(new CustomEvent('open-link', {
                            detail: href
                        }));

                        t('Done');
                    }
                    else {
                        this.dispatchEvent(new CustomEvent('fetch-resource', {
                            detail: {
                                href, options
                            }
                        }));
                    }
                };
                // change language
                this.shadowRoot.getElementById('language').onchange = e => {
                    this.language(e.target.value);
                    const prefs = {
                        'lang': e.target.value,
                        'frequently-used': this.prefs['frequently-used']
                    };
                    prefs['frequently-used'].unshift(prefs.lang);
                    prefs['frequently-used'] = prefs['frequently-used'].filter((s, i, l) => s && l.indexOf(s) === i).slice(0, 10);
                    this.configure(prefs, true);
                    this.dispatchEvent(new Event('language-changed'));
                };
                // change accuracy
                this.shadowRoot.getElementById('accuracy').onchange = e => {
                    this.accuracy(e.target.value);
                    const prefs = {
                        'accuracy': e.target.value
                    };
                    this.configure(prefs, true);
                    this.dispatchEvent(new Event('accuracy-changed'));
                };
                // close
                this.shadowRoot.getElementById('close').onclick = e => {
                    this.remove();
                    this.dispatchEvent(new MouseEvent('closed', {
                        shiftKey: e.shiftKey,
                        ctrlKey: e.ctrlKey,
                        metaKey: e.metaKey
                    }));
                };
                this.shadowRoot.getElementById('star_1').onmouseover = e => {
                    this.shadowRoot.getElementById('star_1').classList.add('chose_star')
                    this.shadowRoot.getElementById('star_2').classList.remove('chose_star')
                    this.shadowRoot.getElementById('star_3').classList.remove('chose_star')
                    this.shadowRoot.getElementById('star_4').classList.remove('chose_star')
                    this.shadowRoot.getElementById('star_5').classList.remove('chose_star')
                };
                this.shadowRoot.getElementById('star_1').onclick = e => {
                    var newURL = "https://google-chrome-extensions.com/apps/Convert-Picture-to-Text/help-us/"
                    window.open(newURL)
                };
                this.shadowRoot.getElementById('star_2').onmouseover = e => {
                    this.shadowRoot.getElementById('star_1').classList.add('chose_star')
                    this.shadowRoot.getElementById('star_2').classList.add('chose_star')
                    this.shadowRoot.getElementById('star_3').classList.remove('chose_star')
                    this.shadowRoot.getElementById('star_4').classList.remove('chose_star')
                    this.shadowRoot.getElementById('star_5').classList.remove('chose_star')
                };
                this.shadowRoot.getElementById('star_2').onclick = e => {
                    var newURL = "https://google-chrome-extensions.com/apps/Convert-Picture-to-Text/help-us/"
                    window.open(newURL)
                };
                this.shadowRoot.getElementById('star_3').onmouseover = e => {
                    this.shadowRoot.getElementById('star_1').classList.add('chose_star')
                    this.shadowRoot.getElementById('star_2').classList.add('chose_star')
                    this.shadowRoot.getElementById('star_3').classList.add('chose_star')
                    this.shadowRoot.getElementById('star_4').classList.remove('chose_star')
                    this.shadowRoot.getElementById('star_5').classList.remove('chose_star')
                };
                this.shadowRoot.getElementById('star_3').onclick = e => {
                    var newURL = "https://google-chrome-extensions.com/apps/Convert-Picture-to-Text/help-us/"
                    window.open(newURL)
                };
                this.shadowRoot.getElementById('star_4').onmouseover = e => {
                    this.shadowRoot.getElementById('star_1').classList.add('chose_star')
                    this.shadowRoot.getElementById('star_2').classList.add('chose_star')
                    this.shadowRoot.getElementById('star_3').classList.add('chose_star')
                    this.shadowRoot.getElementById('star_4').classList.add('chose_star')
                    this.shadowRoot.getElementById('star_5').classList.remove('chose_star')
                };
                this.shadowRoot.getElementById('star_4').onclick = e => {
                    var newURL = "https://chromewebstore.google.com/detail/convert-picture-to-text/dlkjdkiladlnclocjpcikagojeddmkeh/reviews"
                    window.open(newURL)
                };
                this.shadowRoot.getElementById('star_5').onmouseover = e => {
                    this.shadowRoot.getElementById('star_1').classList.add('chose_star')
                    this.shadowRoot.getElementById('star_2').classList.add('chose_star')
                    this.shadowRoot.getElementById('star_3').classList.add('chose_star')
                    this.shadowRoot.getElementById('star_4').classList.add('chose_star')
                    this.shadowRoot.getElementById('star_5').classList.add('chose_star')
                };
                this.shadowRoot.getElementById('star_5').onclick = e => {
                    var newURL = "https://chromewebstore.google.com/detail/convert-picture-to-text/dlkjdkiladlnclocjpcikagojeddmkeh/reviews"
                    window.open(newURL)
                };
                this.shadowRoot.getElementById('rate_block').onmouseout = e => {
                    this.shadowRoot.getElementById('star_1').classList.remove('chose_star')
                    this.shadowRoot.getElementById('star_2').classList.remove('chose_star')
                    this.shadowRoot.getElementById('star_3').classList.remove('chose_star')
                    this.shadowRoot.getElementById('star_4').classList.remove('chose_star')
                    this.shadowRoot.getElementById('star_5').classList.remove('chose_star')
                };


                // expand
                this.shadowRoot.getElementById('expand').onclick = e => {
                    this.dataset.mode = this.dataset.mode === 'expand' ? 'collapse' : 'expand';
                    e.target.value = this.dataset.mode === 'expand' ? 'Collapse' : 'Expand';
                };
                // apply commands on cross-origin (Firefox Only)
                this.addEventListener('command', () => {
                    const { name, args } = JSON.parse(this.getAttribute('command'));
                    this[name](...args);
                });
                // constants
                this.dataset.languages = [...this.shadowRoot.querySelectorAll('#language option')]
                    .map(e => e.value)
                    .filter(s => s !== 'detect')
                    .join(', ');
            }
        }
        customElements.define('ocr-result', OCRResult);
    }
}

