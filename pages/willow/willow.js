let her;
var forgetfulness;
var who = ["him","her"];

var stars = [];


function preload(){
  her = loadImage(random(who)+".png");
  font = loadFont("KodeMono-Regular.ttf");
  }

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent("bg");
  pixelDensity(1);
  background(0);
  
  for (let i = 0; i < 300; i++) {
    stars.push([random(width),random(height),random(6)]);
  }
  
  for (let i = 0; i < stars.length; i++) {
    fill(255)    
    ellipse(stars[i][0], stars[i][1], stars[i][2]);
  }
  
	imageMode(CENTER);
	her.resize(width*0.4,0)
	image(her,width/2,height/2);
	textAlign(CENTER);
	textFont(font);
	fill(255);
  textSize(32);
  text("Dreamer",width/2,height/2);
  forgetfulness = random(10);
}

function draw(){
  if (frameCount%1==0){
  loadPixels();
  for (let y = 1; y < height; y++) {
    if(round(random(forgetfulness))==1){
    for (let x = 0; x < width; x++) {
      var index = (x + y * width) * 4;
      if(round(random(forgetfulness))==1){
        var trpy = round(random(-1,1));
        var trpx = round(random(-1,1));
      pixels[index + 0] = pixels[trpx*4+index-(trpy*width*4) + 0];
      pixels[index + 1] = pixels[trpx*4+index-(trpy*width*4) + 1];
      pixels[index + 2] = pixels[trpx*4+index-(trpy*width*4) + 2];
      pixels[index + 3] = 255;
      }
    }
    }
  }
  updatePixels();
  }
  }