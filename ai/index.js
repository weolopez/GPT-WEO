import { CMS } from '/ai/cms/cms.js'
import { Collection } from '/ai/collection/collection.js';
import { upsert } from '/ai/collection/document.js'
import { popup } from '/ai/cms/popup/popup.js'

let characterCount = 0;
let maxLength = 1000
let cms = new CMS()
let persona;
let mediaType;
let popupObj = new popup();

let addPersona = document.getElementById('addPersona')
addPersona.addEventListener('click', (event) => {
  popupObj.show([{ id: 'persona', label: 'New Persona' }], (result) => {
    let p = new Collection('persona')
    p.get().then((data) => {
      if (!data.find((item) => item.name == result.persona)) {
        p.add({ name: result.persona })
      }
    })
  })
})

await cms.initComponents().then(() => {
  cms.page.componentObject.firstTabs.setCallback((tabid) => {
    if (tabid == 'chat') {
      document.getElementById('chatInput').style.display = 'block'
    } else {
      document.getElementById('chatInput').style.display = 'none'
    }

    if (tabid == 'summary') {
      document.getElementById('copy').style.display = 'block'
    } else {
      document.getElementById('copy').style.display = 'none'
    }
    if (tabid == 'promptArea') {
      document.getElementById('submit').style.display = 'block'
    } else {
      document.getElementById('submit').style.display = 'none'
    }
  })
  cms.page.componentObject.firstTabs.setTab(cms.page.componentObject.firstTabs.currentTabID)
  cms.page.componentObject.logo.setCallback((event) => {
    document.getElementById('sidebar').classList.toggle('visible')
  })
  cms.page.componentObject.media.setCallback((key, value) => {
    // console.log('mediaType callback', key, value)
    mediaType = JSON.parse(value)
    maxLength = Number(mediaType.tokens)
    clipboard.value = mediaType.name + persona
  })
  cms.page.componentObject.persona.setCallback((key, value) => {
    value = JSON.parse(value)
    persona = value
    clipboard.value = mediaType.name + persona.prompt
    displayHistory(key)
  })
  cms.page.componentObject.history.setCallback((userId, value) => {
    window.location.hash = '#historyOutput'
    displayHistory(userId)
  })

  if (!cms.page.componentObject.chat.user) {
    document.getElementById("userID").style.display = "block";
    document.getElementById("chatBox").style.visibility = "hidden";
    // let userIDInput = document.getElementById("userIDInput");
    let userIDSubmit = document.getElementById("userIDSubmit");
    userIDSubmit.addEventListener("click", cms.page.componentObject.chat.userIDSubmit.bind(cms.page.componentObject.chat))
  }

  cms.page.componentObject.chat.setCallback((text) => {
    console.log('chat callback', text)
    // displayHistory(text)
  })
})


clipboard.addEventListener("keydown", function () {
  characterCount = document.getElementById("clipboard").value.length + 1;
  document.getElementById("wordcount").innerHTML = characterCount + `/${maxLength} characters`;
})

//onclick of button with id=submit call submit function
let submitButton = document.getElementById('submit')
submitButton.addEventListener('click', submit)
let running = false;
function submit() {
  if (running) return;
  running = true;
  //change the location to #summary
  window.location.hash = '#summary'
  //TODO expose api to clear the summary
  // document.getElementById("summary").value = ''

  let prompt = clipboard.value
  let size = mediaType.tokens
  cms.page.componentObject.summary.submit(prompt, size)
  running = false;
}

// on click of copy button add the text from the summary paragraph to the clipboard
let copyButton = document.getElementById('copy')
copyButton.addEventListener('click', copy)
function copy() {
  let summary = document.getElementById('gptSummary').value
  navigator.clipboard.writeText(summary)
  let obj = {
    name: persona.name,
    history: {
      name: persona.name,
      persona: persona,
      media: mediaType,
      prompt: clipboard.value,
      date: new Date().toISOString(),
      summary: summary
    }
  }
  upsert('history', 'history', obj).then(out =>
    console.log('upserted', out))
}

if (localStorage.getItem('openai_key')) {
  document.getElementById('openai_key_div').style.display = 'none';
}
else {
  document.getElementById('openai_key_div').style.display = 'block';
}
document.getElementById('saveKey').addEventListener('click', saveKey);
function saveKey() {
  localStorage.setItem('openai_key', document.getElementById('openai_key').value);
  document.getElementById('openai_key_div').style.display = 'none';
  location.reload();
}
// let userID
function displayHistory(userID) {
  let historyCollection = new Collection('histories')
  historyCollection.getByName(userID).then(out => {
    if (out.completion) {
      cms.page.componentObject.chat.setUser(userID, out)
      return
    }
    // get by id=historyList
    let historyList = document.getElementById('historyList')
    historyList.innerHTML = ''
    let counter = 0
    out.history.forEach(item => {
      counter++
      let li = document.createElement('li')
      li.setAttribute('data-objid', JSON.stringify(item))
      li.className = 'blockItem'
      //add a delete font awesome icon to li
      li.id = `prompt${counter}`
      let del = `<i class="fas fa-trash-alt" id="delete${counter}"></i>`
      if (item.prompt) li.innerHTML = `${item.prompt} ` + del
      else li.innerHTML = `${item.config.prompt}    ` + del
      li.addEventListener('click', (event) => {
        let id = event.currentTarget.id
        let sourceElement = event.target
        let counter = id.substring(id.indexOf('t') + 1)
        let item = JSON.parse(event.currentTarget.dataset.objid)
        if (sourceElement.id === `delete${counter}`) {
          out.history.splice(counter - 1, 1)
          historyCollection.update(out)
          displayHistory(userID)
        }
        let historyOutput = document.getElementById(`historyOutput`)
        if (item.prompt) historyOutput.value = JSON.stringify(item, 2, 2)
      })
      historyList.appendChild(li)
    })
  })
}

