let player;
let image = document.getElementById("musicPlayPause");
let slider = document.getElementById("volumeSlider");

//callPlayer("sound", "playVideo");

slider.oninput = function() {
  //console.log(this.value);
  player.setVolume(this.value);
}

function onYouTubeIframeAPIReady(){
  //console.log("api loaded")
  player = new YT.Player('player', {
    height:1,
    width:1,
    videoId:"NivE6ZETBqk",
    playerVars:{
      autoplay:1,
      controls:0,
      listType:'playlist',
      list: 'PLZVAe2HWDfaxYuXG4rOLh8QaCXeXg78lo'
      },
    events:{
    onReady: onPlayerReady
    }})
  }

function nextSong(){
  image.src = "musicPlayer/pause.png"
  player.nextVideo();
  }

function previousSong(){
  image.src = "musicPlayer/pause.png"
  player.previousVideo()
  }
  
function playPause(){
  if (player.getPlayerState() == 1) {
    image.src = "musicPlayer/play.png"
    player.pauseVideo();
  } else{
    image.src = "musicPlayer/pause.png"
    player.playVideo();
  }
}

function openPlayer(){
var taskbar = document.getElementById("platforms");
taskbar.style.display = "inline-block";
player.playVideo();
player.nextVideo();

}

function onPlayerReady(event) {
  console.log("ready")
  player.addEventListener('onStateChange', 'onPlayerStateChange');
  event.target.setVolume(8);
  event.target.setShuffle(true);
  event.target.setLoop(true);
  player.setVolume(8);
  player.setShuffle(true);
  player.setLoop(true);
  openPlayer();
  //image.src = "musicPlayer/pause.png"
}

function onPlayerStateChange( event ) {
    //console.log(player.getPlayerState()) 
    if (player.getPlayerState() == 1) {
    document.getElementById( "currentSong" ).innerText = player.getVideoData().title;
    }
}