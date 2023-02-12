import { component } from '/ai/cms/component/component.js'
import { html } from '/ai/cms/overlay/html.js'
import { Completion } from '/ai/ai/completion.js'
import { upsert } from '/ai/collection/document.js'

export class overlay extends component {
    characterCount
    completion
    constructor(element, cms) {
        super(element, cms)
        this.element.innerHTML = html
        let clipboard = document.getElementById("clipboard")
        this.completion = new Completion()

        clipboard.addEventListener("keydown", function () {
            this.characterCount = document.getElementById("clipboard").value.length + 1;
            document.getElementById("wordcount").innerHTML = this.characterCount + `/${this.maxLength} characters`;
        })
        this.init()
    }
    init() {
        //exectute the following after 1 second
        // setTimeout(() => {
            this.initContextArea()
        // }, 1000)
    }
    initContextArea() {

        this.contextArea = document.getElementById('contextarea')
        //listen to mouse drag events
        this.contextArea.addEventListener('mousedown', this.mouseDown.bind(this))
        this.contextArea.addEventListener('mouseup', () => this.isMouseDown = false)
        this.contextArea.addEventListener('mousemove', this.mouseMove.bind(this))
        //on mouse out, set isMouseDown to false
        this.contextArea.addEventListener('mouseout', () =>  this.isMouseDown = false )
      
    }
    mouseDown(event) {
        this.isMouseDown = true
        this.startX = event.clientX
        this.startY = event.clientY
    }
    mouseMove(event) {
        // this.contextArea set top based on y position of mouse
        if (this.isMouseDown) {
            let x = event.clientX
            let y = event.clientY
            let dx = x - this.startX
            let dy = y - this.startY
            let top = this.contextArea.offsetTop + dy
            this.contextArea.style.top = top + 'px'
            this.startX = x
            this.startY = y
        }
    }

}