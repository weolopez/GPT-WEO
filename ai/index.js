import { CMS } from '/ai/cms/cms.js'
import { Collection } from '/ai/collection/collection.js';
import { upsert } from '/ai/collection/document.js'
import { Popup } from '/ai/cms/popup/popup.js'
import { History } from '/ai/cms/history/history.js'

let characterCount = 0;
let cms = new CMS()
let persona;
let mediaType;
let popupObj = new Popup();
let myHistory = new History();

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

popupObj.getData('openai_key')

await cms.initComponents().then(() => {
  cms.page.componentObject.logo.addCallback((event) => {
    document.getElementById('sidebar').classList.toggle('visible')
  })
  cms.page.componentObject.media.addCallback((result) => {
    // console.log('mediaType callback', key, value)
    let key = result.key
    let value = result.value
    mediaType = JSON.parse(value)

    // clipboard.value = mediaType.name + persona
  })

  myHistory.addCollection(cms.page.componentObject.history.collection)

  cms.page.componentObject.persona.addCallback( result => {
    let key = result.key
    let value = result.value
    value = JSON.parse(value)
    persona = value
    // clipboard.value = mediaType.name + persona.prompt
    myHistory.displayHistory(key)
  })

  cms.page.componentObject.history.addCallback(result => {
    let userId = result.key
    let value = result.value
    if (window.location.hash != '#Chat')
        window.location.hash = '#History'
        myHistory.displayHistory(userId)
  })


  cms.page.componentObject.chat.addCallback((text) => {
    console.log('chat callback', text)
    // displayHistory(text)
  })
})


// clipboard.addEventListener("keydown", function () {
//   characterCount = document.getElementById("clipboard").value.length + 1;
//   document.getElementById("wordcount").innerHTML = characterCount + `/${maxLength} characters`;
// })

// //onclick of button with id=submit call submit function
// let submitButton = document.getElementById('submit')
// submitButton.addEventListener('click', submit)
// let running = false;
// function submit() {
//   if (running) return;
//   running = true;
//   //change the location to #summary
//   window.location.hash = '#Completion'
//   //TODO expose api to clear the summary
//   // document.getElementById("summary").value = ''

//   let prompt = clipboard.value
//   let size = mediaType.tokens
//   cms.page.componentObject.summary.submit(prompt, size)
//   running = false;
// }

// on click of copy button add the text from the summary paragraph to the clipboard
let copyButton = document.getElementById('copy')
copyButton.addEventListener('click', copy)
function copy() {
  let clipboard = document.getElementById('clipboard')
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
