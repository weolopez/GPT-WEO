import { html } from '/ai/cms/popup/html.js'

export class popup {
    popup
    constructor() {
        document.body.innerHTML += html
        let options = {
            keyboard: false
        }
        //create a custom event listenr on window to open the popup
        document.addEventListener('openModel', function (e) {
            console.log(e.detail.id)
            let popup = new bootstrap.Modal(document.getElementById('myModal'), options)
             popup.show()
        })

    }
    show(obj, callback) {
        let options = {
            keyboard: false
        }
        //get modalBody
        let modalBody = document.getElementById('modalBody')
        //clear modalBody
        modalBody.innerHTML = ''
        //loop through obj and create input fields
        obj.forEach((item) => {
            let div = document.createElement('div')
            div.className = 'mb-3'
            let label = document.createElement('label')
            label.className = 'form-label'
            label.innerHTML = item.label
            let input = document.createElement('input')
            input.className = 'form-control'
            input.setAttribute('type', 'text')
            input.setAttribute('id', item.id)
            div.appendChild(label)
            div.appendChild(input)
            modalBody.appendChild(div)
        })
            
        let popup = new bootstrap.Modal(document.getElementById('myModal'), options)
        popup.show()
        let myModal = document.getElementById('myModal')
        myModal.addEventListener('hidden.bs.modal', function (e) {
            //get all the input fields
            let inputs = myModal.querySelectorAll('input')
            let obj = {}
            //loop through the input fields and create an object
            inputs.forEach((input) => {
                obj[input.id] = input.value
            })
            //call the callback function
            callback(obj)
        })
    }

}