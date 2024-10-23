const musicPlayerLib = document.createElement("script");
musicPlayerLib.type = "module";
musicPlayerLib.src = "/sitewide/libs/howler.min.js";
document.head.appendChild(musicPlayerLib);

let sound = new Howl({
    src: ['/sitewide/apps/musicPlayer/test.mp3'],
});

sound.play();
console.log(sound);