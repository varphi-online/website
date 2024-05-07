var cube = document.querySelector('.cube');
var rotate = [0,0,0]

function play() {
  cube.style.transform = "translateZ(-20px) rotateY("+rotate[0] +"deg)" + "rotateX("+rotate[1] +"deg)"+"rotateZ("+rotate[2] +"deg)";
  rotate[0] = rotate[0]+.6*2;
  rotate[1] = rotate[1]+.4*2;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function pause(){
await sleep(1000);
setInterval(play, 100);
}

pause();