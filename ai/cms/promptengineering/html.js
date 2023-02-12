export const html = `<textarea id="promptEngineeringArea" maxlength="3500"
class="paper">$promp</textarea>`


export const htmlold = `
<div id="textCanvas" class="paper">

</div>
<div class="marginRight" style="display: flex; justify-content: space-between;">
    <div id="wordcount">0/1000</div>
</div>
<style>
#promptEngineering {
    height: 77vh;
}

.promptContainer {
    background: lightgray;
    color: black;
    display: block;
    height: auto;
    position: relative;
    top: 0;
    z-index: 2;
}
#recycle {
    color: black;
    left: 3px;
    opacity: 0.1;
    position: absolute;
    top: 3px;
    z-index: 5;
}

.promptContainer:hover #recycle {
    color: black;
    font-size: 1.5em;
    opacity: .5;
    pointer: cursor;
}
.prompt { 
    overflow: scroll;
    position: relative;
    top: 0;
    white-space: pre;
    z-index: 3;
}
</style>
`
export const promptContainer = `
    <div class="promptContainer" style="background: #{color};">
        <button id="recycle" class="recycle"><i class="recycle fa-solid fa-recycle"></i></button>
        <div class="prompt" contenteditable="true">#{text}</div>
`

// display: block;
// overflow: scroll;
// white-space: pre;
// width: 100%;
// z-index: 1; 