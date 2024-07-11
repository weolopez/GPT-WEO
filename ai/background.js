
chrome.runtime.onInstalled.addListener(() => {

  var contextMenuItem = {
    "id": "aiContextMenu",
    "title": "AI v2",
    "contexts": ["all"]
  };

  chrome.contextMenus.create(contextMenuItem);

  chrome.contextMenus.create({
    title: "Summarize",
    parentId: "aiContextMenu",
    id: "summarize",
    contexts: ["all"]
  });

  chrome.contextMenus.create({
    id: "showSelectedText",
    title: "Query",
    parentId: "aiContextMenu",
    contexts: ["selection"]
  });

});

chrome.contextMenus.onClicked.addListener((info, tab) => {

  if (info.menuItemId === "summarize") {

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: showDialog,
      args: [info.selectionText]
    });
  }
  if (info.menuItemId === "showSelectedText") {
    chrome.windows.create({
      url: "http://localhost:8080/GenContext?text=" + info.selectionText,
      type: "popup",
      width: 900,
      height: 600
    });
  }
});

function showDialog(selectedText) {
  const dialog = document.createElement('dialog');
  question = "Summarize: " + selectedText;
  fetch("http://localhost:8080/ask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question: question,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      dialog.textContent = data.Response;

      document.body.appendChild(dialog);
      dialog.showModal();

      dialog.addEventListener('click', () => {
        dialog.close();
        dialog.remove();
      });
      //toggle details open
    })
    .catch((error) => {
      console.error("Error:", error);
    });


}
