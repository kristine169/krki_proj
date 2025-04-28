chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "addToFlashcards",
    title: "Add to Flashcards",
    contexts: ["selection"]
  });
});

async function postCard(apiUrl, cardData) {
  try {
    const response = await fetch(`${apiUrl}/api/cards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(cardData)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error("Error posting card:", error);
    return false;
  }
}

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "addToFlashcards" && info.selectionText && tab.id) {
    chrome.storage.sync.get(['apiUrl'], async (result) => {
      const apiUrl = result.apiUrl;
      if (!apiUrl) {
        alert("API URL is not set. Please set it in the extension options.");
        return;
      }
      try {
        const [result] = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['contentScript.js']
        });
        const cardData = result.result;
        if (!cardData) {
          return; // User cancelled or no data
        }
        const success = await postCard(apiUrl, cardData);
        if (success) {
          alert("Flashcard added successfully!");
        } else {
          alert("Failed to add flashcard. Check console for details.");
        }
      } catch (error) {
        console.error("Error executing content script:", error);
        alert("Error occurred. Check console for details.");
      }
    });
  }
});
