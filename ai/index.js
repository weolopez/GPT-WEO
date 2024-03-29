import { CMS } from '/ai/cms/cms.js'
import { Collection } from '/ai/collection/collection.js';
import { Popup } from '/ai/cms/popup/popup.js'
import { History } from '/ai/cms/history/history.js'

let characterCount = 0;
let cms = new CMS()
// let persona;
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

await cms.initComponents()
cms.page.componentObject.logo.addCallback((event) => {
  document.getElementById('sidebar').classList.toggle('visible')
})

myHistory.addCollection(cms.page.componentObject.history.collection)

cms.page.componentObject.chat.addCallback((text) => {
  console.log('chat callback', text)
  // displayHistory(text)
})
