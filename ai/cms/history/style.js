export const style = `
.deleteHistoryButton {
    top: 0;
    right: 0;
    position: absolute;
}
.scroll {
    white-space: nowrap;
    height: 44vh;
    max-width: 20vw;
}

.linkList {
    list-style-type: none;
    padding: 0;
}

.blockItem {
    background: rgb(68 70 84);
    overflow: auto;
    width: 20vw;
    margin: 0;
    padding: 3px;
}

.blockItem:hover {
    background: #343541;
    width: 80vw;
}

.blockItem i:hover {
    font-size: 24px;
    font-weight: bolder;
    border-radius: 50%;
}
`