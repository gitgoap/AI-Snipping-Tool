document.addEventListener('DOMContentLoaded', function () {
    const saveButton = document.getElementById('saveButton');
    const apiKeyInput = document.getElementById('apiKey');

    // Load the saved API key
    chrome.storage.sync.get('apiKey', function (data) {
        if (data.apiKey) {
            apiKeyInput.value = data.apiKey;
        }
    });

    // Save the API key
    saveButton.addEventListener('click', function () {
        const apiKey = apiKeyInput.value;
        chrome.storage.sync.set({ 'apiKey': apiKey }, function () {
            console.log('API key saved.');
        });
    });
});
