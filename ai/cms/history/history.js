import { CMS } from '/ai/cms/cms.js'
import { getHTML } from '/ai/cms/history/html.js'
import { style } from '/ai/cms/history/style.js'

export class History {
    
   historyCollection
   currentHistoryItem
   currentHistory
    constructor(historyCollection) {
        this.historyCollection = historyCollection
        if (style) {
            let div = document.createElement('style')
            div.innerHTML = style
            document.body.appendChild(div)
        }

        let historyButton = document.getElementById('editHistory')
        historyButton.addEventListener('click', this.editHistory.bind(this))

        // let historyButton = document.getElementById('editHistory')
        // historyButton.addEventListener('click', this.editHistory.bind(this))
        //get element by class deleteHistoryButton

        document.addEventListener('history', result => {          
            if (!result) return
            this.displayHistory(result.detail.key)
        })
        // this.addCollection(CMS.cms.page.componentObject.history.collection)

    }
    editHistory() {
        let prompt = this.currentHistoryItem.prompt;
        let summaryText = this.currentHistoryItem.summary;

        let clipboard = document.getElementById('clipboard')
        let summary = document.getElementById('gptSummary')
        clipboard.value = prompt
        summary.value = summaryText
        window.location.hash = '#Prompt_Area'

    }
    addCollection(historyCollection) {
        this.historyCollection = historyCollection
    }

    displayHistory(userID) {
        this.userID = userID
        this.historyCollection.getByName(userID).then(out => {
            this.currentHistory = out
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
                else li.innerHTML =  (item.config) ? `${item.config.prompt}    ` + del : ''
                li.addEventListener('click', (event) => {
                    let id = event.currentTarget.id
                    let sourceElement = event.target
                    let counter = id.substring(id.indexOf('t') + 1)
                    this.currentHistoryItem = JSON.parse(event.currentTarget.dataset.objid)
                    if (sourceElement.id === `delete${counter}`) {
                        out.history.splice(counter - 1, 1)
                        this.historyCollection.update(out)
                        displayHistory(userID)
                    }
                    this.displayHistryRecord(counter)
                })
                historyList.appendChild(li)
            })
        })
    }
    displayHistryRecord(counter) {
        let historyOutput = document.getElementById(`historyOutput`)
        if (!counter) {
            historyOutput.innerHTML = ''
            return
        }
        let template = getHTML(this.currentHistoryItem,counter);
        console.log(template)

        historyOutput.innerHTML = template// JSON.stringify(this.currentHistoryItem, 2, 2)
        let deleteHistoryButton = document.getElementsByClassName('deleteHistoryButton')[0]
        deleteHistoryButton.addEventListener('click', this.deleteHistory.bind(this))

    }
    deleteHistory(event) {
        //get id of the element clicked
        let id = event.currentTarget.id
        let counter = id.substring(id.indexOf('t') + 2)
        this.currentHistory.history.splice(counter - 1, 1)
        this.historyCollection.update(this.currentHistory)
        this.displayHistory(this.userID)
        this.displayHistryRecord()
    }
}