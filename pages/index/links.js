import { addApp, appInitEvent, Application } from "../../sitewide/apps/applicationManager.js";
document.addEventListener(appInitEvent.type, () => {
    if (!(window.location.hash.substring(1) === "links"))
        return;
    const linksApp = document.createElement('div');
    linksApp.innerHTML = `
      <div class="app" data-window_title="linkShareDONTRUN.exe" data-icon_name="Links :3" data-icon="Microphone & Cassette.ico" data-movable style="left: calc(50vw - 41dvh / 2); top: calc(47dvh - 70dvh / 2); display: block">
        <div style="
          background-image: url('/pages/index/blobz.gif');
          color: black;
          width: 40dvh;
          height: 75dvh;
          margin: 2px;
          background-repeat: repeat;
          background-size: 100px 100px;
          background-color: lightblue;
          background-blend-mode: multiply;
          font-family: 'comik', sans-serif;
          box-shadow:
            inset -1px -1px #f1f0f1,
            inset -2px -2px #eaebea,
            inset 1px 1px #323132,
            inset 2px 2px #414041;">
            <div style="display: flex; flex-direction: column; align-items: center; padding: 10px; gap: 20px; height: 100%; box-sizing: border-box;">
            <div style="display: flex; align-items: center; justify-content: center; gap: 5px;">
              <img src="/pages/index/arrow.png" style="height: 3dvh; -webkit-filter: drop-shadow(1px 1px 0px black); filter: drop-shadow(1px 1px 0px black);"/>
              <h2 style="color: white; margin: 0px; text-shadow: 2px 2px 2px black">LISTEN HERE!!</h2>
            </div>
              <img src="/pages/index/RC1.png" style="width: 25dvh; box-shadow: 2px 2px 2px black"/>
              <div id="linkzz">
                <style>
                  @font-face {
                    font-family: 'comik';
                    src: url('/pages/index/CS.ttf') format('truetype');
                    src: url('/pages/index/CS.woff2') format('woff2');
                  }

                  #linkzz {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 12px;
                    width: 60%;
                    overflow-y: auto;
                    padding-bottom: 2px;
                  }

                  #linkzz *>img {
                    width: 30px;
                    height: 30px;
                    margin-right: 8px;
                    
                  }

                  .linq {
                    display: flex;
                    padding-left: 15px;
                    align-items: center;
                    width: 90%;
                    box-shadow:
                      inset 1px 1px #f1f0f1,
                      inset 1.5px 2px #eaebea,
                      1px 1px #323132,
                      2px 2px #414041;
                      height: 50px;
                      
                    border-radius: 2px;
                  }
                  
                  .linq:hover {
                    background-color: #010080;
                    color: white;
                    cursor: alias;
                  }

                  .linq img {
                    -webkit-filter: drop-shadow(2px 2px 0px black);
                    filter: drop-shadow(2px 2px 0px black);
                  }
                </style>
                <a class="win95 linq"
                  href="https://open.spotify.com/artist/1hMrh5wetHbeiJYBezuEPs?si=aXMsvaFwT86NiAlWRh3fMw" target="_blank">
                  <img src="/sitewide/taskbar/logos/spotify_logo.png" />
                  <p>Spotify</p>
                </a>
                <a class="win95 linq" href="https://varphiartist.bandcamp.com/" target="_blank">
                  <img src="/sitewide/taskbar/logos/bandcamp_logo.png" />
                  <p>Bandcamp</p>
                </a>
                <a class="win95 linq" href="https://music.apple.com/ee/artist/varphi/1648184088"
                  target="_blank">
                  <img src="/sitewide/taskbar/logos/apple_music_logo.png" />
                  <p>Apple Music</p>
                </a>
                <a class="win95 linq" href="https://www.youtube.com/@varphiartist"
                  target="_blank">
                  <img src="/sitewide/taskbar/logos/youtube_logo.webp" />
                  <p>YouTube</p>
                </a>
                <a class="win95 linq" href="https://tidal.com/artist/34788896" target="_blank">
                  <img src="/sitewide/taskbar/logos/tidal_logo.png" style="filter: invert(1);"/>
                  <p>Tidal</p>
                </a>
            </div>
        </div>
    </div>`;
    const appElem = linksApp.firstElementChild;
    if (!appElem)
        return;
    console.log(linksApp.firstElementChild);
    document.body.append(appElem);
    const app = new Application(appElem, window.appManager.windowTemplate, window.appManager.taskbar, false);
    addApp(app);
    app.moveToFront();
});
