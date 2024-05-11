'use strict';

// const notify = e => chrome.notifications.create({
//   type: 'basic',
//   iconUrl: '/icons/icon-48.png',
//   title: chrome.runtime.getManifest().name,
//   message: e.message || e
// });

chrome.action.onClicked.addListener(async tab => {
  try {
    await chrome.scripting.insertCSS({
      target: {
        tabId: tab.id
      },
      files: ['inject/inject.css']
    });
    await chrome.scripting.executeScript({
      target: {
        tabId: tab.id
      },
      files: ['inject/inject.js']
    });
    chrome.action.setIcon({
      tabId: tab.id,
      path: {
        
        '48': 'icons/logo.png'
      }
    });
  }
  catch (e) {
    console.error(e);
    // notify(e);
  }
});

chrome.runtime.onMessage.addListener((request, sender, response) => {
  if (request.method === 'captured' || request.method === 'aborted') {
    chrome.action.setIcon({
      tabId: sender.tab.id,
      path: {
        
        '48': 'icons/logo.png'
      }
    });
  }
  //
  if (request.method === 'captured') {
    const { devicePixelRatio, left, top, width, height } = request;

    if (!width || !height) {
      return;
      // return notify('Please select a region. Either width or height of the captured area was zero');
    }
    chrome.tabs.captureVisibleTab(sender.tab.windowId, {
      format: 'png'
    }, async href => {
      try {
        const target = {
          tabId: sender.tab.id
        };
        if (/Firefox/.test(navigator.userAgent) === false) {
          await chrome.scripting.executeScript({
            target,
            files: ['/inject/custom-elements.min.js']
          });
          await chrome.scripting.executeScript({
            target,
            files: ['/inject/elements.js']
          });
        }
        else {
          await chrome.scripting.executeScript({
            target,
            func: () => {
              const s = document.createElement('script');
              s.src = chrome.runtime.getURL('/inject/elements.js');
              document.body.append(s);
            }
          });
        }
        await chrome.scripting.executeScript({
          target,
          files: ['/engine/helper.js']
        });
        await chrome.scripting.executeScript({
          target,
          files: ['/inject/response.js']
        });
        await chrome.scripting.insertCSS({
          target,
          files: ['/inject/font-awesome.min.css']
        });
        // start
        chrome.storage.local.get({
          'post-method': 'POST',
          'post-href': '',
          'post-body': '',
          'lang': 'eng',
          'frequently-used': ['eng', 'fra', 'deu', 'rus', 'ara'],
          'accuracy': '4.0.0'
        }, prefs => chrome.scripting.executeScript({
          target,
          func: (prefs, href, box) => {
            const em = document.querySelector('ocr-result:last-of-type');
            em.command('configure', prefs);
            em.command('prepare');

            em.href = href;
            em.box = box;

            em.run();
          },
          args: [prefs, href, {
            width: width * devicePixelRatio,
            height: height * devicePixelRatio,
            left: left * devicePixelRatio,
            top: top * devicePixelRatio
          }]
        }));
      }
      catch (e) {
        console.error(e);
        
      }
    });
  }
  else if (request.method === 'open-link') {
    chrome.tabs.create({
      url: request.href,
      index: sender.tab.index + 1
    });
  }
  else if (request.method === 'remove-indexeddb') {
    caches.delete('traineddata').finally(response);
    try {
      indexedDB.databases().then(as => {
        for (const { name } of as) {
          indexedDB.deleteDatabase(name);
        }
      });
    }
    catch (e) { }

    return true;
  }
});

chrome.runtime.onInstalled.addListener((details) => {
  // We no longer use IndexedDB
  try {
    indexedDB.databases().then(as => {
      for (const { name } of as) {
        indexedDB.deleteDatabase(name);
      }
    });
  }
  catch (e) { }

  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    
    chrome.tabs.create({
      url: "https://github.com/gitgoap/HackFest-24-IIT-Dhanbad",
    });
  } else if (details.reason === chrome.runtime.OnInstalledReason.UPDATE) {
    
  } else if (
    details.reason === chrome.runtime.OnInstalledReason.CHROME_UPDATE
  ) {
    
  } else if (
    details.reason === chrome.runtime.OnInstalledReason.SHARED_MODULE_UPDATE
  ) {
    
  }
  chrome.contextMenus.create({
    "id": 'ocr_start',
    "title": "screenshot",
    "visible": true,
  });
});

chrome.contextMenus.onClicked.addListener(async tab => {

  try {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [current_tab] = await chrome.tabs.query(queryOptions);
    console.log(current_tab)

    await chrome.scripting.insertCSS({
      target: {
        tabId: current_tab.id
      },
      files: ['inject/inject.css']
    });
    await chrome.scripting.executeScript({
      target: {
        tabId: current_tab.id
      },
      files: ['inject/inject.js']
    });
    chrome.action.setIcon({
      tabId: current_tab.id,
      path: {
        
        '48': 'icons/logo.png'
      }
    });
  }
  catch (e) {
    console.error(e);
    
  }
})

chrome.runtime.setUninstallURL('https://amanprakash.dev/');
