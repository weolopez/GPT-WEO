import { component } from '/ai/cms/component/component.js'
import { html } from '/ai/cms/chat/html.js'
import { weoai } from '/ai/ai/weo.js';

export class chat extends component {
    constructor(element, cms, callback) {
        super(element, cms, callback)
        this.element.innerHTML = html

        this.user = localStorage.getItem('user')
     

        // get element with id="myInput" and caputure keypress event
        this.input = document.getElementById("chatInput");
        this.input.addEventListener("keypress", this.keypress.bind(this))
        
        this.messages = [
            { txt: 'It looks beautiful', date: '2016-09-10T16:45:12.914Z', from: 'John Doe', direction: 1 },
           ]

        this.randomDate = function () {
            var start = new Date(2016, 10, 2);
            var end = new Date();
            return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
        }


        document.addEventListener('persona', this.setUser.bind(this))
    }
    setUser(event) {
        this.user = event.detail.key
        let collabthread = document.getElementById("collabthread");
        collabthread.innerHTML = ''
        chatHistoryData.history.forEach( dialog => {
            let ai = dialog.completion.choices[0].text
            let me = dialog.config.prompt
            let dateMade = new Date(dialog.completion.created*1000).toISOString()
            this.addMessage(me, 'out', dateMade)
            this.addMessage(ai, 'in', dateMade)
        })

    }
    keypress (event) {
        //check if enter key is pressed using event key code
        if (event.code === "Enter") {
            // alert("You pressed enter!")
            event.preventDefault();
            this.doPost();
        }
    };
    doPost() {
        let txt = this.input.value
        this.addMessage(this.input.value, 'out')
        this.input.value = "";

        this.addMessage('..', 'in')
        this.getResponse(txt)
    }


    getResponse(txt) {

        weoai(txt, this.user, 280).then( (data) => {
            data = data.history.completion.choices[0].text
            console.log(data);
            if (typeof data === 'string') {
                //remove last child of collabthread
                document.getElementById("collabthread").removeChild(document.getElementById("collabthread").lastChild);
                this.addMessage(data, 'in')
            }
            else console.error(JSON.stringify(data,2,2));
        })
    }

    scrollDown() {
        var focusBottom = document.getElementById("collabthread");
        focusBottom.scrollTop = focusBottom.scrollHeight;
    }
    randomDate(start, end) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }
    addMessage(txt, direction, dateMade) {
        //convert dateMade in epoc format to ISO string format
        let date = dateMade || new Date().toISOString();
        let message = ` <div class="message" >
                            <div class="${direction}">
                                <pre class="m-0" style="color:white;background: transparent;white-space: pre-wrap;       /* css-3 */
                                white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
                                white-space: -pre-wrap;      /* Opera 4-6 */
                                white-space: -o-pre-wrap;    /* Opera 7 */
                                word-wrap: break-word; ">${txt.trim()}</pre>
                                <date><b> ${date} </b> </date>
                            </div>
                        </div>
        `
        // get element with id='collabthread' and append the new message
        let collabthread = document.getElementById("collabthread");
        let newMessage = document.createElement("div");
        newMessage.innerHTML = message;
        collabthread.appendChild(newMessage);
        this.scrollDown();
    }
    // userIDSubmit(event) {
    //     event.preventDefault();
    //     //get by id userIDInput
    //     this.userIDInput = document.getElementById("userIDInput");
    //     this.setUser(this.userIDInput.value);
    //     localStorage.setItem('user', this.userIDInput.value);
    //     document.getElementById("userID").style.display = "none";
    //     document.getElementById("chatBox").style.display = "block";
    // }
}