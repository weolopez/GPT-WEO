import { component } from '/ai/component/component.js'
import { mystyle } from '/ai/component/jsoneditor/style.js'
import { html } from '/ai/component/jsoneditor/html.js'
import { JSONEditor } from './vanilla-jsoneditor/index.js'
import { CMS } from '/ai/cms/cms.js'

export class jsoneditor extends component {
  wrapper
  content
  constructor() {
    super();


    const shadow = this.attachShadow({ mode: 'open' });
    this.wrapper = document.createElement('div');
    this.wrapper.setAttribute('id', 'jsoneditor');
    this.wrapper.setAttribute('style', 'position: fixed; top: -400px; left: 0; width: 100%; height: 400px; z-index: 9999; background: #fff; border-top: 1px solid #ccc; transition: 0.3s all; overflow: auto;');
    this.wrapper.classList.add('jse-theme-dark');

    document.addEventListener('keydown', this.toggle.bind(this))

    const style = document.createElement('style');
    style.textContent = mystyle


    // shadow.appendChild(this.wrapper);
    // shadow.appendChild(style);
    document.body.appendChild(style);
    document.body.appendChild(this.wrapper);

    this.editor = new JSONEditor({
      target: this.wrapper,
      props: {
        onChange: (updatedContent, previousContent, { contentErrors, patchResult }) => {
          // content is an object { json: JSONData } | { text: string }
          // console.log('onChange', { updatedContent, previousContent, contentErrors, patchResult })
          this.content = updatedContent
        }
      }
    })
  }
  toggle(event) {
    if ( (event.ctrlKey && event.key === 'e') ||
       (event.metaKey && event.key === 's') ) {
      event.preventDefault()
      let isEdit = this.wrapper.style.top === '0px'

      if (isEdit) {
        this.wrapper.style.top = '-400px'
        if (this.content) {
          CMS.cms.page.data = this.content.json
          CMS.cms.save()
        }
      } else {
        let content = {
          text: undefined,
          json: CMS.cms.page.data
        }
        this.editor.set(content)
        this.wrapper.style.top = '0px'
      }
    }
  }
}

// Define the new element
customElements.define('json-editor', jsoneditor);
