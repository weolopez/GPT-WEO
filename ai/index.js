import { CMS } from '/ai/cms/cms.js'
import { Collection } from '/ai/collection/collection.js';
import { upsert } from '/ai/collection/document.js'

//create a variable for all the child elements inside mediaContent
// let mediaContent = document.getElementById('mediaContent').children

let characterCount = 0;
let maxLength = 1000
let cms = new CMS()
let persona;
let mediaType;
await cms.initComponents().then(() => {
  cms.page.componentObject.firstTabs.setCallback((tabid) => {
    console.log('firstTabs callback', tabid)
    // hide footer if tabid = 'chat' or 'history'
    if (tabid == 'chat' || tabid == 'historyOutput') {
      document.getElementById('footer').style.display = 'none'
    } else {
      document.getElementById('footer').style.display = 'flex'
    }
    if (tabid == 'summery') {
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


  cms.page.componentObject.mediaType.setCallback((key, value) => {
    // console.log('mediaType callback', key, value)
    mediaType = JSON.parse(value)
    maxLength = Number(value)
    clipboard.value = mediaType + persona
  })

  cms.page.componentObject.persona.setCallback((key, value) => {
    // console.log('persona callback', key, value)
    value = JSON.parse(value)
    persona = value
    clipboard.value = mediaType + persona.prompt
    // chat(persona.name)
  })
  cms.page.componentObject.history.setCallback((key, value) => {
    // console.log('persona callback', key, value)
    // value = JSON.parse(value)
    // persona = value
    // clipboard.value = mediaType + persona.prompt
    chat(key)
  })

  if (!cms.page.componentObject.chat.user) {
    document.getElementById("userID").style.visibility = "visible";
    document.getElementById("chatBox").style.visibility = "hidden";
    // let userIDInput = document.getElementById("userIDInput");
    let userIDSubmit = document.getElementById("userIDSubmit");
    userIDSubmit.addEventListener("click", cms.page.componentObject.chat.userIDSubmit.bind(cms.page.componentObject.chat))
  }
  cms.page.componentObject.chat.setCallback((text) => {
    console.log('chat callback', text)
    // chat(text)
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
  if (running) {
    return;
  }
  running = true;
  //change the location to #summery
  window.location.hash = '#summery'

  document.getElementById("summery").innerHTML = ''
  let prompt = clipboard.value
  // let persona = `create a ${selectedMedia.key} written by${personaTextArea.value} about`
  // //get a length of the prompt
  // let promptLength = prompt.length
  // prompt = persona.substring(0,maxLength-prompt.length)+" "+ prompt
  let size = 4000 
  getCompletion(prompt, size, event => {
    if (event.data[0].finish_reason === 'stop') {
      running = false;
      var completion = document.getElementById("summery").innerHTML
      var historyEntry = {
        prompt: prompt,
        completion: completion,
        persona: 'weo'
      }
      historyCollection.add(historyEntry).then(hist => {
        console.log('history added', hist)
        document.getElementById("summery").innerHTML += "\n\n"+hist._id
      })
    }

    //append event data to paragraph with id=summery
    document.getElementById("summery").innerHTML += event.data[0].text;
  })
}
function getCollectionHistory() {
  var token = localStorage.getItem('openai_key')
  if (token == null) return
  token = 'sk' + token.substring(token.indexOf('-') + 1)
  return new Collection(token, (history) => {
    console.log('history: ', history)
  })
}
var historyCollection = getCollectionHistory()

// on click of copy button add the text from the summery paragraph to the clipboard
let copyButton = document.getElementById('copy')
copyButton.addEventListener('click', copy)
function copy() {
  let summery = document.getElementById('summery').innerText
  navigator.clipboard.writeText(summery)
  let obj = {
    name: persona.name,
    history: {
      name: persona.name,
      persona: persona,
      media: mediaType,
      prompt: clipboard.value,
      summery: summery
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
  // document.getElementById('not_openai_key_div').style.display = 'block';
  //reload page
  location.reload();
}

function chat(id) {
  let chat = document.getElementById('historyOutput')
  chat.innerHTML = ''
  let chatCollection = new Collection('histories')
  chatCollection.getByName(id).then(out => {
    // console.log('out', out)
    out.history.forEach(item => {
      let div = document.createElement('div')
      if (item.prompt) div.innerHTML = `<p>${item.name}:${item.prompt}</p><p>AI: ${item.summery}</p>`
      else div.innerHTML = `<p>${item.from}:${item.config.prompt}</p><p>AI: ${item.completion.choices[0].text}</p>`
      chat.appendChild(div)
    })
  })
}

