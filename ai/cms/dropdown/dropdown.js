import { Component } from '/ai/cms/component.js'
import { Collection } from '/ai/collection/collection.js'

export class dropdown extends Component {
    constructor(element, cms, callback) {
        super(element, cms, callback)

        //get attribute data-collection from the element
        this.collectionName = element.getAttribute('data-collection')

        if (this.collectionName) {
            this.collection = new Collection(this.collectionName, (data) => {
                this.setOptions(data)
            })
            this.collection.get()
        } else if (cms.page.data[this.id]) {
            this.setOptions(cms.page.data[this.id])
        } else {
            console.warn('no data found for dropdown', this.id)
        }
    }
    save(data) {
        if (this.collectionName) {
            //TODO update the data that changed
            this.data = data
            this.collection.update(this.data)
        }
        //TODO add support for CMS page data
    }
    setOptions(options) {
        this.data = options
        if (typeof this.data === 'string') return
        if (typeof this.data === 'object' &&
            !Array.isArray(this.data) &&
            this.data !== null) {
                Object.keys(this.data).forEach(key => {
                    let option = document.createElement('option')
                    option.value = JSON.stringify(this.data[key])
                    option.innerHTML = key
                    this.element.appendChild(option)
                })
        } else {
            this.data.forEach(obj => {
                let option = document.createElement('option')
                //if obj is a string then create an option with name and value
                if (typeof obj === 'string') {
                    option.value = obj
                    option.innerHTML = obj
                } else {
                    option.value = JSON.stringify(obj)
                    option.innerHTML = obj.name
                }
                this.element.appendChild(option)
            })
        }
        this.element.addEventListener('change', (event)=>{
            let target = event.target
            let selectedIndex = target.selectedIndex
            let selectedValue = target.options[selectedIndex].value
            let selectedKey = target.options[selectedIndex].innerHTML
            this.callback(selectedKey, selectedValue)
        })
        //call the callback with the first option
        // this.callback(this.element.options[0].innerHTML, this.element.options[0].value)
    }
    setCallback(callback) {
        this.callback = callback

        //simulate a click on the first option
        this.element.selectedIndex = 1
        if (this.element.options.length < 1) return
        callback(this.element.options[1].innerHTML, this.element.options[1].value)

    }
}