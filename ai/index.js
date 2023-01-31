import { CMS } from '/ai/cms/cms.js'
import { Collection } from '/ai/collection/collection.js';
import { upsert } from '/ai/collection/document.js'

let characterCount = 0;
let maxLength = 1000
let cms = new CMS()
let persona;
let mediaType;
await cms.initComponents().then(() => {
  cms.page.componentObject.firstTabs.setCallback((tabid) => {
    // console.log('firstTabs callback', tabid)
    // hide footer if tabid = 'chat' or 'history'
    // if (tabid == 'chat' || tabid == 'historyOutput') {
      // document.getElementById('footer').style.display = 'none'
      // get #chatInput and set focus
      // document.getElementById('chatInput').focus()
    // } else {
      // document.getElementById('footer').style.display = 'flex'
    // }
    if (tabid == 'summary') {
      document.getElementById('copy').style.display = 'block'
    } else {
      document.getElementById('copy').style.display = 'none'
    }
    //only display submit button if tabid = 'promptArea'
    if (tabid == 'promptArea') {
      document.getElementById('submit').style.display = 'block'
    } else {
      document.getElementById('submit').style.display = 'none'
    }
  })

  cms.page.componentObject.firstTabs.setTab(cms.page.componentObject.firstTabs.currentTabID)
  cms.page.componentObject.logo.setCallback((event) => {
    // get element with id = sidebar and toggle the class 'visible'
    document.getElementById('sidebar').classList.toggle('visible')
  })


  cms.page.componentObject.media.setCallback((key, value) => {
    // console.log('mediaType callback', key, value)
    mediaType = JSON.parse(value)
    maxLength = Number(mediaType.tokens)
    clipboard.value = mediaType.name + persona
  })

  cms.page.componentObject.persona.setCallback((key, value) => {
    // console.log('persona callback', key, value)
    value = JSON.parse(value)
    persona = value
    clipboard.value = mediaType.name + persona.prompt
    // displayHistory(persona.name)
  })
  cms.page.componentObject.history.setCallback((key, value) => {
    displayHistory(key)
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
  cms.page.componentObject.summary.submit(prompt,size)
      running = false;
      // var historyEntry = {
      //   prompt: prompt,
      //   completion: completion,
      //   persona: 'weo'
      // }
      // historyCollection.add(historyEntry).then(hist => {
      //   // console.log('history added', hist)
      //   document.getElementById("summary").value += "\n\n"+hist._id
      // })
}

// function getCollectionHistory() {
//   var token = localStorage.getItem('openai_key')
//   if (token == null) return
//   token = 'sk' + token.substring(token.indexOf('-') + 1)
//   return new Collection(token, (history) => {
//     // console.log('history: ', history)
//   })
// }
// var historyCollection = getCollectionHistory()

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
      summary: summary
    }
  }

  upsert('history', 'history', obj).then(out =>
    console.log('upserted', out))
}



// if localstorage has 'openai_key' hide div with id=openai_key_div
if (localStorage.getItem('openai_key')) {
  document.getElementById('openai_key_div').style.display = 'none';
  // document.getElementById('not_openai_key_div').style.display = 'block';
}
// if localstorage doesn't have 'openai_key' show div with id=openai_key_div
else {
  document.getElementById('openai_key_div').style.display = 'block';
  // document.getElementById('not_openai_key_div').style.display = 'none';
}

// on click of button with id=saveKey, call saveKey function
document.getElementById('saveKey').addEventListener('click', saveKey);
// on click of button with id=saveKey, set localstorage 'openai_key' to value of input with id=openai_key
function saveKey() {
  localStorage.setItem('openai_key', document.getElementById('openai_key').value);
  document.getElementById('openai_key_div').style.display = 'none';
  //reload page
  location.reload();
}

function displayHistory(id) {
  let chat = document.getElementById('historyOutput')
  chat.innerHTML = ''
  let chatCollection = new Collection('histories')
  chatCollection.getByName(id).then(out => {
    // console.log('out', out)
    let counter = 0
    out.history.forEach(item => {
      counter++
      let div = document.createElement('div')
      div.id = `prompt${counter}`
      if (item.prompt) div.innerHTML = `<p>${item.name}:${item.prompt}</p><p  id="summary${counter}" style="display: none">AI: ${item.summary}</p>`
      else div.innerHTML = `<p>${item.from}:${item.config.prompt}</p><p  id="summary${counter}"  style="display: none">AI: ${item.completion.choices[0].text}</p>`
      //on click of prompt${counter} toggle showing summary${counter} 
      div.addEventListener('click', (event) => {
        //get id of event target
        let id = event.currentTarget.id
        //get the number of the prompt
        let counter = id.substring(id.indexOf('t') + 1)
        let summary = document.getElementById(`summary${counter}`)
        if (summary.style.display === 'none') summary.style.display = 'block'
        else summary.style.display = 'none'
      })
      chat.appendChild(div)
    })
  })
}

