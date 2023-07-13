export const html = `

<div class="progress">
</div>
<div id="count" style="position: absolute;
right: 0;
top: 0;"></div>
<style>
    .progress {
        width: 0%;
        height: 100%;
        background-color: lightblue;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 2;
        opacity: 0.5;
    }

    .changewidth {
      animation: mymove 15s;
      animation-iteration-count: infinite;
    }

    @keyframes mymove {
      from {width: 0px;}
      to {width: 100%;}
    }
    
</style>
`