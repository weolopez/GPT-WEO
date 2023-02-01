import { Component } from '../componentInterface.js'
import { html } from './html.js'

export class tabs  extends Component {
    currentTabID

    constructor(element, cms, callback) {
        super(element, cms, callback)

        var ul = document.createElement('ul')
        ul.className = 'nav nav-tabs'
        var children = this.element.children
        for (var i = 0; i < children.length; i++) {
            
            //create li element
            var li = document.createElement('li')
            li.className = 'nav-item'

            //create a element
            var a = document.createElement('a')
            a.className = 'nav-link'
            a.href = '#'+children[i].getAttribute('id')
            
            //set a innerHTML to child attribute name
            a.innerHTML = children[i].getAttribute('name')
            window.addEventListener('hashchange', function () {
                //get location hash from window.location.href and split on # and get second element which is tab
                this.setTab(window.location.href.split('#')[1])
            }.bind(this))

            //add a to li
            li.appendChild(a)
            //add li to ul
            ul.appendChild(li)
        }
        this.element.insertBefore(ul, this.element.children[0])

    var div = document.createElement('div')
    div.innerHTML = html 
    this.element.appendChild(div)
    
    if (window.location.href.split('#')[1]){
        this.setTab(window.location.href.split('#')[1])
    } else {
        this.setTab(children[1].getAttribute('id'))
    }
    // const hash = window.location.hash;
    // if (hash) {
    //   const tab = document.querySelector(hash+'i');
    //   tab.click()
    //   //set tab to target
    // }

    }
    setTab(id) {
        //for children of ul find a with href = "#id" and set class to active
        var children = this.element.children[0].children
        for (var i = 0; i < children.length; i++) {
            if (children[i].children[0].href.includes(id)) {
                children[i].children[0].className = 'nav-link active'
            } else {
                children[i].children[0].className = 'nav-link'
            }
        }
        //for children of element find child with id = id and set style to display: block
        var children = this.element.children
        for (var i = 1; i < children.length; i++) {
            if (children[i].id == id) {
                children[i].style.display = 'block'
            } else {
                children[i].style.display = 'none'
            }
        }
        this.currentTabID = id
        if (this.callback) this.callback(id)
    }
}