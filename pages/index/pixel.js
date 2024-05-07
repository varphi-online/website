// https://stackoverflow.com/questions/66624701/pixelate-a-whole-webpage/66625778#66625778
var pixelated = true;

function pixelate(tileSize = 10, sigmaGauss = 2) {
  tileSize = tileSize < 1 ? 1 : tileSize;
  //sigmaGauss = sigmaGauss < 1 ? 1 : sigmaGauss;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // only to make the output visible
  // document.body.appendChild(canvas);

  const rows = canvas.height / tileSize;
  const cols = canvas.width / tileSize;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      ctx.fillStyle = "white";

      ctx.fillRect(
        c * tileSize - 1 + Math.floor(tileSize / 2),
        r * tileSize - 1 + Math.floor(tileSize / 2),
        1,
        1
      );
    }
  }

  const pixelate = document.getElementById("pixelate");
  pixelate.innerHTML = "";

  const blur = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "feGaussianBlur"
  );
  blur.setAttribute("in", "SourceGraphic");
  blur.setAttribute("stdDeviation", sigmaGauss);
  blur.setAttribute("result", "blurred");

  const hmap = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "feImage"
  );
  const hmapUrl = canvas.toDataURL();
  hmap.setAttribute("href", hmapUrl);
  hmap.setAttribute("result", "hmap");

  const blend = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "feBlend"
  );
  // blend.setAttribute("mode", "lighten");
  blend.setAttribute("mode", "multiply");
  blend.setAttribute("in", "blurred");
  blend.setAttribute("in2", "hmap");

  const morph = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "feMorphology"
  );
  morph.setAttribute("operator", "dilate");
  morph.setAttribute("radius", tileSize / 2);

  pixelate.setAttribute("width", canvas.width);
  pixelate.setAttribute("height", canvas.height);
  pixelate.appendChild(blur);
  pixelate.appendChild(hmap);
  pixelate.appendChild(blend);
  pixelate.appendChild(morph);
}

function togglePixel() {
  const pixelateElement = document.getElementById("pixelate");
  
  if (pixelated) {
    // Turn off pixelation
    pixelateElement.innerHTML = "";
    pixelated = false;
  } else {
    // Turn on pixelation
    pixelate(4, 0.5);
    pixelated = true;
  }
}

// Only run on pc's
//https://stackoverflow.com/questions/38241480/detect-macos-ios-windows-android-and-linux-os-with-js
function getOS() {
  const userAgent = window.navigator.userAgent,
      platform = window.navigator?.userAgentData?.platform || window.navigator.platform,
      macosPlatforms = ['macOS', 'Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
      windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
      iosPlatforms = ['iPhone', 'iPad', 'iPod'];
  let os = null;

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = 'Mac OS';
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = 'iOS';
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = 'Windows';
  } else if (/Android/.test(userAgent)) {
    os = 'Android';
  } else if (/Linux/.test(platform)) {
    os = 'Linux';
  }

  return os;
}

var os = getOS();
if (os=='Windows'||os=='Linux'||os=='Mac OS'){
  pixelate(4, 0.5);
  } else {
    pixelated = false;
  }