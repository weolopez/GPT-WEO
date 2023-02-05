const html = `
<style>
    .scroll {
        white-space: nowrap;
        height: 44vh;
        max-width: 20vw;
    }

    .linkList {
        list-style-type: none;
        padding: 0;
    }

    .blockItem {
        background: rgb(68 70 84);
        overflow: auto;
        width: 20vw;
        margin: 0;
        padding: 3px;
    }

    .blockItem:hover {
        background: #343541;
        width: 80vw;
    }

    .blockItem i:hover {
        font-size: 24px;
        font-weight: bolder;
        border-radius: 50%;
    }
</style>
`
export class History {
    
   historyCollection
    constructor(historyCollection) {
        this.historyCollection = historyCollection
        if (html) {
            let div = document.createElement('div')
            div.innerHTML = html
            document.body.appendChild(div)
        }
    }
    addCollection(historyCollection) {
        this.historyCollection = historyCollection
    }

    displayHistory(userID) {
        this.historyCollection.getByName(userID).then(out => {
            // if (out.history[0].completion) {
            //     cms.page.componentObject.chat.setUser(userID, out)
            //     return
            // }
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
                        this.historyCollection.update(out)
                        displayHistory(userID)
                    }
                    let historyOutput = document.getElementById(`historyOutput`)
                    if (item.prompt) historyOutput.value = JSON.stringify(item, 2, 2)
                })
                historyList.appendChild(li)
            })
        })
    }
}