export const html=` <style>
  form.chat * {
    transition: all .5s;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
  }

  form.chat {
    margin: 0;
    cursor: default;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    -webkit-touch-callout: none;
    /* iOS Safari */
    -webkit-user-select: none;
    /* Chrome/Safari/Opera */
    -khtml-user-select: none;
    /* Konqueror */
    -moz-user-select: none;
    /* Firefox */
    -ms-user-select: none;
    /* IE/Edge */
    user-select: none;
  }

  form.chat span.spinner {
    animation: loading-bar 2s 1;
    display: block;
    height: 2px;
    background-color: #00e34d;
    transition: width 0.2s;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 4
  }

  form.chat .messages {
    display: block;
    overflow-x: hidden;
    overflow-y: scroll;
    position: relative;
    height: 90%;
    width: 100%;
    padding: 2% 3%;
    border-bottom: 1px solid #ecf0f1;
  }

  form.chat ::-webkit-scrollbar {
    width: 3px;
    height: 1px;
    transition: all .5s;
    z-index: 10;
  }

  form.chat ::-webkit-scrollbar-track {
    background-color: white;
  }

  form.chat ::-webkit-scrollbar-thumb {
    background-color: #bec4c8;
    border-radius: 3px;
  }

  form.chat .message {
    display: block;
    width: 98%;
    padding: 0.5%;
  }

  form.chat .out,
  form.chat .in {
    max-width: 50%;
    word-wrap: break-word;
    margin-bottom: 20px;
  }

  form.chat .message:hover .out {
    transform: translateX(-130px);
  }

  form.chat .message:hover .in {
    transform: translateX(130px);
  }

  form.chat .message:hover date {
    opacity: 1;
  }

  form.chat .out,
  .in {
    position: relative;
    padding: 10px 20px;
    color: white;
    border-radius: 25px;
    clear: both;
    font: 400 15px 'Open Sans', sans-serif;
  }

  form.chat .out {
    background: #00e34d;
    color: white;
    float: right;
    clear: both;
    border-bottom-right-radius: 20px 0px;
  }
/*
  form.chat .out:before {
    content: "";
    position: absolute;
    z-index: 1;
    bottom: -2px;
    right: -8px;
    height: 19px;
    border-right: 20px solid #00e34d;
    border-bottom-left-radius: 16px 14px;
    transform: translate(0, -2px);
    border-bottom-left-radius: 15px 0px;
    transform: translate(-1px, -2px);
  }*/

/*  form.chat .out:after {
    content: "";
    position: absolute;
    z-index: 1;
    bottom: -2px;
    right: -42px;
    width: 12px;
    height: 20px;
    background: white;
    border-bottom-left-radius: 10px;
    transform: translate(-30px, -2px);
  }*/

  form.chat .initial {
    background: #eee;
    color: #999;
    position: absolute;
    z-index: 5;
    padding: 8px 0;
    border-radius: 50%;
    right: -40px;
    top: 0;
    bottom: 0;
    height: 32px;
    width: 32px;
    display: inline;
    text-align: center;
  }

  form.chat .in {
    background: #086efd;
    color: white;
    float: left;
    clear: both;
    border-bottom-left-radius: 30px 0px;
  }
/*
  form.chat .in:before {
    content: "";
    position: absolute;
    z-index: 2;
    bottom: -2px;
    left: -7px;
    height: 19px;
    border-left: 20px solid #E5E5EA;
    border-bottom-right-radius: 16px 14px;
    transform: translate(0, -2px);
    border-bottom-right-radius: 15px 0px;
    transform: translate(-1px, -2px);
  }

  form.chat .in:after {
    content: "";
    position: absolute;
    z-index: 3;
    bottom: -2px;
    left: 4px;
    width: 26px;
    height: 20px;
    background: white;
    border-bottom-right-radius: 10px;
    transform: translate(-30px, -2px);
  }
*/
  form.chat date {
    position: absolute;
    top: 10px;
    font-size: 14px;
    white-space: nowrap;
    vertical-align: middle;
    color: #8b8b90;
    opacity: 0;
    z-index: 4;
  }

  form.chat .out date {
    left: 105%;
  }

  form.chat .in date {}

  form.chat input {
    font: 400 13px 'Open Sans', sans-serif;
    border: 0;
    padding: 0 15px;
    height: 10%;
    outline: 0;
  }

  form.chat input[type='text'] {
    width: 73%;
    float: left;
  }

  form.chat input[type='submit'] {
    width: 23%;
    background: transparent;
    color: #00E34D;
    font-weight: 700;
    text-align: right;
    float: right;
  }

  form.chat .out,
  form.chat .in {
    font-size: 18px;
    //bold font
    font-weight: 600;
  }

  form.chat .message:hover .out {
    transform: translateY(18px);
  }

  form.chat .message:hover .in {
    transform: translateY(18px);
  }

  form.chat .out date,
  form.chat .in date {
    top: -20px;
    left: auto;
    font-size: 12px;
  }

  form.chat .out,
  form.chat .in {
    max-width: 90%;
  }

  @-moz-keyframes loading-bar {
    0% {
      width: 0%;
    }

    90% {
      width: 90%;
    }

    100% {
      width: 100%;
    }
  }

  @-webkit-keyframes loading-bar {
    0% {
      width: 0%;
    }

    90% {
      width: 90%;
    }

    100% {
      width: 100%;
    }
  }

  @keyframes loading-bar {
    0% {
      width: 0%;
    }

    90% {
      width: 90%;
    }

    100% {
      width: 100%;
    }
  }
</style>
<div id="userID" style="visibility:hidden">
    <input id="userIDInput" type="text" placeholder="Your name"/>
    <button id="userIDSubmit"  class="marginRight btn btn-primary btn-sm">Submit</button>
</div>
<div id="chatBox">
  <form class=" chat"><span></span>
  <div class="messages" id="collabthread">
    
  </div>
  <input id="chatInput" type="text" placeholder="Your message">
  <input id="chatSubmit" type="submit" value="Send" ">
  </form>
</div>
`