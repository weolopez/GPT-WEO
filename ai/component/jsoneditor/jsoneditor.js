
import { component } from '/ai/component/component.js'

export class jsoneditor extends component {
    constructor() {
      // Always call super first in constructor
      super();
  
      // Create a shadow root
      const shadow = this.attachShadow({mode: 'open'});
    }
}