import { component } from '/ai/component/component.js'
import { mystyle } from '/ai/component/popupinfo/style.js'
import { html } from '/ai/component/popupinfo/html.js'

export class popupinfo extends component {
    constructor() {
      super()

      let text = this.getAttribute('data-text')
      const shadow = this.attachShadow({mode: 'open'})
      const wrapper = document.createElement('span')
      const style = document.createElement('style')

      wrapper.innerHTML = html.replace("#{data}", text)
      shadow.appendChild(wrapper)
      style.textContent = mystyle 
      shadow.appendChild(style)
    }
  }
  
  // Define the new element
  customElements.define('popup-info', popupinfo);
