

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
                    font-family: Verdana, sans-serif;
                    display: flex;
                    position: fixed;
                    top: 10px;
                    right: 10px;
                    /* padding: 5px; */
                    z-index: 10000000000;
                    gap: 5px;
                    flex-direction: column;
                    background-color: transparent;
                    height: 30vh;
                    width: 40vw;
                    max-height: 500px;
                    max-width: 50vw;
                    color-scheme: light;
                    
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
        body {
        font-family: Verdana, sans-serif;
        font-size: 12px;
        background-color: #f5f5f7;
        margin: 0;
        padding: 0;
        color: #333;
    }

    #body {
        font-family: Verdana, sans-serif;
        max-height: 510px;
        width: 340px;
        padding: 15px;
        border-radius: 8px;
        background-color: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(10px);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
    }

    #top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        padding-bottom: 8px;
        border-bottom: solid;
    }

    .logo-title {
        display: flex;
        align-items: center;
    }

    .logo {
        width: 20px;
        height: 20px;
        margin-right: 6px;
    }

    .right-icons {
        display: flex;
        align-items: center;
    }

    .github-link {
        margin-right: 10px;
    }

    .github-logo {
        fill: currentColor;
    }

    #toggle-dark-mode {
        margin-left: 10px;
    }

    .dark-toggle {
        cursor: pointer;
    }

    #close,
    #copy {
        font-family: Verdana, sans-serif;
        border: solid;
        background: none;
        font-size: 14px;
        cursor: pointer;
        color: #007AFF;
        width: 15%;
        padding: 4px;
        white-space: nowrap;
    }

    label {
        display: block;
        font-weight: 500;
        margin: 8px 0 4px;
        color: #333;
    }

    #result,
    #result-in-process,
    #prompt,
    #key,
    #summary-area {
        font-family: Verdana, sans-serif;
        background-color: #fff;
        color: #333333;
        border: 1px solid #d1d1d1;
        border-radius: 10px;
        padding: 8px;
        font-size: 12px;
        width: 80%;
    }

    #save-key {
        width: 15%;
        font-size: 11px;
        margin-left: 4px;
    }

    #api-key-section {
        display: flex;
    }

    #result,
    #result-in-process {
        overflow-y: scroll;
        height: 35px;
    }

    #tools {
        margin-top: 12px;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .tool-row {
        display: flex;
        justify-content: space-between;
        gap: 8px;
    }

    .tool-row > * {
        flex: 1;
        min-width: 0;
    }

    select.language_select,
    button {
        width: 100%;
        padding: 6px 10px;
        border-radius: 10px;
        border: 1px solid #d1d1d1;
        background-color: #f5f5f7;
        font-size: 12px;
        color: #333;
        transition: all 0.2s ease;
        cursor: pointer;
    }

    button {
        font-family: Verdana, sans-serif;
        background-color: #007AFF;
        color: #fff;
        border: none;
        font-weight: 500;
    }

    button:hover {
        background-color: #0056b3;
    }

    #summary-area {
        font-family: Verdana, sans-serif;
        height: 35px;
        margin-top: 8px;
        padding: 8px;
        border-radius: 10px;
        background-color: rgba(245, 245, 247, 0.6);
        backdrop-filter: blur(5px);
        overflow-y: scroll;
        border-style: solid;
    }

    #answer-heading {
        margin-top: 0;
    }

    :host {
        --fg: #031b30;
        --bg: #f0f3f4;
        --bg-inputs: #8e44ad;
        --bg-select: #0d1117;
        --bg-result: #ffffff;
        --bg-inputs-hover: #5d2a73;
        --accent: #3fa5b9;
        --border-color: none;
        --text-color: #2e4053;
        --button-color: #ffffff;
        --width: 360px;
        --height: 270px;
        --gap: 8px;
    }

    :host([dark-mode]) {
        --background-color: #06041a;
        --text-color: #e0e0e0;
    }

    :host([dark-mode]) #body {
        background-color: #06041a;
        color: #e0e0e0;
    }

    :host([dark-mode]) #result,
    :host([dark-mode]) #result-in-process,
    :host([dark-mode]) #prompt,
    :host([dark-mode]) #key,
    :host([dark-mode]) #summary-area {
        background-color: #202938;
        color: #E67E22;
        border-color: #4a4a4a;
    }

    :host([dark-mode]) label {
        color: #FDDE5A;
    }

    :host([dark-mode]) select.language_select,
    :host([dark-mode]) button {
        background-color: #2c3e50;
        color: #ecf0f1;
        border-color: #4a4a4a;
    }

    :host([dark-mode]) button {
        background-color: #007AFF;
    }

    :host([dark-mode]) button:hover {
        background-color: #0056b3;
    }

    :host([dark-mode]) #toggle-dark-mode {
        fill: #FDDE5A;
    }

    :host([dark-mode]) .section-heading a {
        color: #FDDE5A;
    }

    .preview-button-container {
        margin-bottom: 8px;
    }

    #preview-screenshot {
        color: #ecf0f1;
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 4px 8px;
        background-color: #2c3e50;
        border-color: #4a4a4a;
        border: 1px solid;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    #preview-screenshot:hover {
        background-color: #34495e;
    }

    #preview-screenshot svg {
        width: 14px;
        height: 14px;
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
    <div id="top">
        <div class="logo-title">
            <img src="https://raw.githubusercontent.com/gitgoap/AI-Snipping-Tool/main/icons/logo.png" alt="AI Snipping Tool Logo" class="logo">
            <span class="section-heading">
                <a href="https://github.com/gitgoap/AI-Snipping-Tool">AI Snipping Tool</a>
            </span>
        </div>
        <div class="right-icons">
            <svg id="toggle-dark-mode" stroke="currentColor" fill="#9044ac" stroke-width="0" viewBox="0 0 16 16" class="dark-toggle cursor-pointer" height="28" width="28" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"></path>
                <path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z"></path>
            </svg>
        </div>
        <button id="copy" disabled>Copy</button>
        <button id="close" title="${this.locales.close}"><i class="fa fa-close"></i>Close</button>
    </div>
    <div class="preview-button-container">
    <button id="preview-screenshot" title="Preview Screenshot">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
            <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z"/>
        </svg>
        Preview Screenshot
    </button>
    </div>
    <label for="result">OCR Text</label>
    <div id="result" data-msg="Please wait..." style="display:none;"></div>
    <div id="result-in-process">
        <svg aria-hidden="true" class="spinner" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
        </svg>
    </div>
    <div id="prompt-functions">
        <label for="prompt">Prompt</label>
        <input type="text" placeholder="Ask a question" id="prompt">
        </br>
        <label for="api-key-section">API Key</label>
        <div id="api-key-section">
            <input type="text" placeholder="Enter your Gemini API key" id="key">
            <button id="save-key">Save</button>
        </div>
    </div>
    <div id="tools">
        <div class="tool-row">
            <select id="language" class="language_select">
                <optgroup>
                    <option value="detect">Auto Detect (beta)</option>
                </optgroup>
                <optgroup id="frequently-used"></optgroup>
                <optgroup>
                    <option value="afr">Afrikaans</option>
                    <option value="amh">Amharic</option>
                    <option value="ara">Arabic</option>
                    <option value="asm">Assamese</option>
                    <option value="aze">Azerbaijani</option>
                    <option value="aze_cyrl">Azerbaijani - Cyrillic</option>
                    <option value="bel">Belarusian</option>
                    <option value="ben">Bengali</option>
                    <option value="bod">Tibetan</option>
                    <option value="bos">Bosnian</option>
                    <option value="bul">Bulgarian</option>
                    <option value="cat">Catalan; Valencian</option>
                    <option value="ceb">Cebuano</option>
                    <option value="ces">Czech</option>
                    <option value="chi_sim">Chinese - Simplified</option>
                    <option value="chi_tra">Chinese - Traditional</option>
                    <option value="chr">Cherokee</option>
                    <option value="cym">Welsh</option>
                    <option value="dan">Danish</option>
                    <option value="deu">German</option>
                    <option value="dzo">Dzongkha</option>
                    <option value="ell">Greek, Modern (1453-)</option>
                    <option value="enm">English, Middle (1100-1500)</option>
                    <option value="eng">English</option>
                    <option value="epo">Esperanto</option>
                    <option value="est">Estonian</option>
                    <option value="eus">Basque</option>
                    <option value="fas">Persian</option>
                    <option value="fra">French</option>
                    <option value="fin">Finnish</option>
                    <option value="frk">German Fraktur</option>
                    <option value="frm">French, Middle (ca. 1400-1600)</option>
                    <option value="gle">Irish</option>
                    <option value="glg">Galician</option>
                    <option value="grc">Greek, Ancient (-1453)</option>
                    <option value="guj">Gujarati</option>
                    <option value="hat">Haitian; Haitian Creole</option>
                    <option value="heb">Hebrew</option>
                    <option value="hin">Hindi</option>
                    <option value="hrv">Croatian</option>
                    <option value="hun">Hungarian</option>
                    <option value="iku">Inuktitut</option>
                    <option value="ind">Indonesian</option>
                    <option value="isl">Icelandic</option>
                    <option value="ita">Italian</option>
                    <option value="ita_old">Italian - Old</option>
                    <option value="jav">Javanese</option>
                    <option value="jpn">Japanese</option>
                    <option value="jpn_vert">Japanese - Vertical</option>
                    <option value="kan">Kannada</option>
                    <option value="kat">Georgian</option>
                    <option value="kat_old">Georgian - Old</option>
                    <option value="kaz">Kazakh</option>
                    <option value="khm">Central Khmer</option>
                    <option value="kir">Kirghiz; Kyrgyz</option>
                    <option value="kor">Korean</option>
                    <option value="kur">Kurdish</option>
                    <option value="lao">Lao</option>
                    <option value="lat">Latin</option>
                    <option value="lav">Latvian</option>
                    <option value="lit">Lithuanian</option>
                    <option value="mal">Malayalam</option>
                    <option value="mar">Marathi</option>
                    <option value="mkd">Macedonian</option>
                    <option value="mlt">Maltese</option>
                    <option value="msa">Malay</option>
                    <option value="mya">Burmese</option>
                    <option value="nep">Nepali</option>
                    <option value="nld">Dutch; Flemish</option>
                    <option value="nor">Norwegian</option>
                    <option value="ori">Oriya</option>
                    <option value="pan">Panjabi; Punjabi</option>
                    <option value="pol">Polish</option>
                    <option value="por">Portuguese</option>
                    <option value="pus">Pushto; Pashto</option>
                    <option value="ron">Romanian; Moldavian; Moldovan</option>
                    <option value="rus">Russian</option>
                    <option value="san">Sanskrit</option>
                    <option value="sin">Sinhala; Sinhalese</option>
                    <option value="slk">Slovak</option>
                    <option value="slv">Slovenian</option>
                    <option value="spa">Spanish; Castilian</option>
                    <option value="spa_old">Spanish; Castilian - Old</option>
                    <option value="sqi">Albanian</option>
                    <option value="srp">Serbian</option>
                    <option value="srp">latn Serbian - Latin</option>
                    <option value="swa">Swahili</option>
                    <option value="swe">Swedish</option>
                    <option value="syr">Syriac</option>
                    <option value="tam">Tamil</option>
                    <option value="tel">Telugu</option>
                    <option value="tgk">Tajik</option>
                    <option value="tgl">Tagalog</option>
                    <option value="tha">Thai</option>
                    <option value="tir">Tigrinya</option>
                    <option value="tur">Turkish</option>
                    <option value="uig">Uighur; Uyghur</option>
                    <option value="ukr">Ukrainian</option>
                    <option value="urd">Urdu</option>
                    <option value="uzb">Uzbek</option>
                    <option value="uzb_cyrl">Uzbek - Cyrillic</option>
                    <option value="vie">Vietnamese</option>
                    <option value="yid">Yiddish</option>
                </optgroup>
            </select>
            <button id="answer">Submit</button>
        </div>
        <div class="tool-row">
            <button id="save-screenshot">Save Screenshot</button>
            <button id="save-text">Save Text</button>
        </div>
        <div class="tool-buttons">
            <button id="post" disabled title="${this.locales.post}" style="display:none;">Post Result</button>
        </div>
        <label for="summary-area" id="answer-heading" style="display: none;">Prompt Response
    </div>
    <div id="summary-area" style="display: none;"></div>


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
                this.shadowRoot.getElementById().dataset.msg = value;
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
                // Preview screenshot
                this.shadowRoot.getElementById('preview-screenshot').onclick = e => {
                    chrome.storage.local.get('ocr-screenshot', function(result) {
                        const url = result['ocr-screenshot'];
                        if (url) {
                            const screenWidth = window.screen.width;
                            const screenHeight = window.screen.height;
                            const windowWidth = Math.max(400, Math.min(600, screenWidth * 0.5));
                            const windowHeight = Math.max(300, Math.min(450, screenHeight * 0.5));
                            const left = (screenWidth - windowWidth) / 2;
                            const top = (screenHeight - windowHeight) / 2;

                            const previewWindow = window.open("", "Screenshot Preview", 
                                `width=${windowWidth},height=${windowHeight},left=${left},top=${top},resizable=yes,scrollbars=yes`);
                            
                            previewWindow.document.write(`
                                <html>
                                    <head>
                                        <title>Screenshot Preview</title>
                                        <style>
                                            body {
                                                margin: 0;
                                                padding: 10px;
                                                display: flex;
                                                flex-direction: column;
                                                justify-content: center;
                                                align-items: center;
                                                height: 100vh;
                                                background-color: #f0f0f0;
                                                box-sizing: border-box;
                                                font-family: Arial, sans-serif;
                                            }
                                            #image-container {
                                                display: flex;
                                                justify-content: center;
                                                align-items: center;
                                                height: calc(100% - 50px);
                                                width: 100%;
                                                overflow: auto;
                                            }
                                            img {
                                                max-width: 100%;
                                                max-height: 100%;
                                                object-fit: contain;
                                                box-shadow: 0 0 10px rgba(0,0,0,0.1);
                                                transition: transform 0.3s ease;
                                            }
                                            #controls {
                                                display: flex;
                                                gap: 10px;
                                                margin-top: 10px;
                                            }
                                            button {
                                                padding: 5px 10px;
                                                cursor: pointer;
                                            }
                                        </style>
                                    </head>
                                    <body>
                                        <div id="image-container">
                                            <img src="${url}" alt="Captured Screenshot" id="preview-image">
                                        </div>
                                        <div id="controls">
                                            <button id="zoom-in">Zoom In</button>
                                            <button id="zoom-out">Zoom Out</button>
                                            <button id="rotate-left">Rotate Left</button>
                                            <button id="rotate-right">Rotate Right</button>
                                        </div>
                                        <script src="${chrome.runtime.getURL('engine/preview-controls.js')}"></script>
                                    </body>
                                </html>
                            `);
        } else {
            alert("No screenshot available to preview.");
        }
    });
};

                // Add dark mode toggle logic
                this.shadowRoot.getElementById('toggle-dark-mode').onclick = () => {
                    const isDarkMode = this.hasAttribute('dark-mode');
                    if (isDarkMode) {
                        this.removeAttribute('dark-mode');
                        chrome.storage.local.remove('dark-mode');
                    } else {
                        this.setAttribute('dark-mode', '');
                        chrome.storage.local.set({ 'dark-mode': 'true' });
                    }
                };

                // Apply saved dark mode preference
                chrome.storage.local.get('dark-mode', function(result) {
                    if (result['dark-mode'] === 'true') {
                      this.setAttribute('dark-mode', '');
                    }
                  }.bind(this));

                // Enter saved API Key in the API Key input field.
                chrome.storage.local.get('gemini-api-key', function(result) {
                    const API_KEY = result['gemini-api-key'];
                    if (API_KEY !== undefined) { 
                        // Check if API_KEY is not undefined
                        const apiKeyField = this.shadowRoot.querySelector('#key');
                        apiKeyField.value = API_KEY;
                        }
                    }.bind(this));

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
                // get answer
                this.shadowRoot.getElementById('answer').onclick = e => {
                  const ocr_text = this.shadowRoot.getElementById('result').innerText;
                  const API_KEY = this.shadowRoot.getElementById('key').value;
                  const prompt = this.shadowRoot.getElementById('prompt').value;
                  const question = `Prompt-"${prompt}". Context-"${ocr_text}"`;
                  fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      "contents": [
                        { "parts": [{ "text": question }] }
                      ]
                    })
                  })
                  .then(response => response.json())
                  .then(data => {
                    const generatedSummary = data.candidates[0].content.parts[0].text;
                    const summaryArea = this.shadowRoot.getElementById('summary-area');
                    summaryArea.textContent = generatedSummary;
                    
                    summaryArea.style.display = 'block';
                    this.shadowRoot.getElementById('answer-heading').style.display = 'block';
                  })
                  .catch(error => {
                    console.error('Error:', error);
                  });
                };

                // Save API Key
                this.shadowRoot.getElementById('save-key').onclick = e => {
                    var API_KEY = this.shadowRoot.getElementById('key').value;
                    chrome.storage.local.set({ 'gemini-api-key': API_KEY }, function() {
                    console.log(API_KEY);
                    });
                };
  

                // Save text
                this.shadowRoot.getElementById('save-text').onclick = e => {
                  const textToSave = this.shadowRoot.getElementById('result').innerText;
              
                  // Create a blob for the OCR text
                  const blob = new Blob([textToSave], { type: 'text/plain' });
              
                  // Create a link element
                  const link = document.createElement('a');
                  link.download = 'ocr-result.txt';
              
                  // Create object URL for the blob
                  link.href = window.URL.createObjectURL(blob);
              
                  // Append the link to the Shadow DOM and click it
                  this.shadowRoot.appendChild(link);
                  link.click();
              
                  // Remove the link from the Shadow DOM
                  this.shadowRoot.removeChild(link);
              };
                             
              // Save screenshot
                this.shadowRoot.getElementById('save-screenshot').onclick = e => {
                    chrome.storage.local.get('ocr-screenshot', function(result) {
                    const url = result['ocr-screenshot'];
                    
                    // Create a link element
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'screenshot.png';
                    
                    // Append the link to the Shadow DOM and click it
                    this.shadowRoot.appendChild(a);
                    a.click();
                    
                    // Remove the link from the Shadow DOM
                    this.shadowRoot.removeChild(a);
                    }.bind(this));
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

