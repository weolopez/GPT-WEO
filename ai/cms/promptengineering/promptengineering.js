import { component } from '/ai/cms/component/component.js'
import { html, promptContainer } from '/ai/cms/promptengineering/html.js'
import { Completion } from '/ai/ai/completion.js'
import { upsert } from '/ai/collection/document.js'


export class promptengineering extends component {
    characterCount
    completion
    constructor(element, cms) {
        super(element, cms)
        this.element.innerHTML = html
        // this.textCanvas = document.getElementById("textCanvas")
        this.completion = new Completion()
        
        // this.element.addEventListener('click', e => {
        //     if (e.target.classList.contains('recycle')) {
        //         this.onclick(e, e.target)
        //     }
        // })
        
        // clipboard.addEventListener("keydown", function () {
        //     this.characterCount = document.getElementById("clipboard").value.length + 1;
        //     document.getElementById("wordcount").innerHTML = this.characterCount + `/${this.maxLength} characters`;
        // })

        document.addEventListener('save', this.save.bind(this), false);
        document.addEventListener('generate', this.generate.bind(this), false);


        this.init()
    }
    onclick(e, element) {
        //find parent of element with class of promptContainer and find child with class of prompt
        let prompt = element.closest('.promptContainer').querySelector('.prompt')
        this.getCompletion(prompt)
    }
    init() {
        //get prompt from localstorage
        let prompt = localStorage.getItem('prompt')
        let clipboard = document.getElementById("promptEngineeringArea")
        clipboard.value = prompt
    }
    append(text, isAI = false) {
        let p = promptContainer.replace("#{text}", text)
        if (isAI) {
            p = p.replace("#{color}", "lightgrey")
        } else {
            p = p.replace("#{color}", "white")
        }
        // this.textCanvas.innerHTML += p
    }
    async getCompletion(prompt) {
        // let text = prompt.innerText
        // 
        let completion = await this.completion.getWithOrder(0,prompt)
        this.append(completion.text, true)
        console.log(completion.text)
        return completion.text
    }
    async generate() {
        //get by id clipboard
        let clipboard = document.getElementById("promptEngineeringArea")
        //get value of clipboard
        let prompt = clipboard.value
        clipboard.value += await this.getCompletion(prompt)
    }
    save() {
        let prompts = this.textCanvas.querySelectorAll('.prompt')
        let text = ''
        //create an array of strings
        let promptsArray = []
        for (let prompt of prompts) {
            promptsArray.push(prompt.innerText)
        }
        //persists to localstorage
        localStorage.setItem('prompts', JSON.stringify(promptsArray))   

            
    }
}
