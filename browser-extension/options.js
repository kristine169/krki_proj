document.getElementById('save').addEventListener('click', () => {
    const apiUrl = document.getElementById('apiUrl').value;
    chrome.storage.sync.set({ apiUrl }, () => {
      alert('API URL saved!');
    });
  });
  
  // Load saved API URL
  chrome.storage.sync.get(['apiUrl'], (result) => {
    if (result.apiUrl) {
      document.getElementById('apiUrl').value = result.apiUrl;
    }
  });
  