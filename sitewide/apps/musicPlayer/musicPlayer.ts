class musicPlayer {
  currentSong: HTMLAudioElement;
  playlist: [string, string][];
  songIndex: number;
  paused: boolean;
  seekTime: number;
  volume: number;
  songLength: number;
  seeking: boolean = false;

  elements = {
    playbackButtonImage: document.getElementById(
      "musicPlayPause",
    ) as HTMLImageElement,
    volumeSlider: document.getElementById("volumeSlider") as HTMLInputElement,
    songTitle: document.getElementById("currentSong") as HTMLSpanElement,
    seekSlider: document.getElementById("seekSlider") as HTMLInputElement,
    playPauseButton: document.getElementById(
      "playPauseButton",
    ) as HTMLButtonElement,
    nextSongButton: document.getElementById(
      "nextSongButton",
    ) as HTMLButtonElement,
    prevSongButton: document.getElementById(
      "prevSongButton",
    ) as HTMLButtonElement,
  };

  playlists = {
    website: [
      ["website/jrpg_end.mp3", "JRPG End"],
      ["website/Birds.mp3", "birds/egodeath"],
      ["fote6/dark_forest_hypothesis.mp3", "Dark Forest Hypothesis"],
      [
        "eos/a_goodbye_to_someone_who_doesn't_exist_anymore.mp3",
        "a goodbye to someone who doesn't exist anymore",
      ],
      ["website/whole_heart.mp3", "Whole Heart"],
      ["website/after_the_end.mp3", "After the End"],
      ["website/poolside.mp3", "Poolside"],
    ] as [string, string][],
    discography: [
      ["singles/wing_sauce.mp3", "Wing Sauce"],
      ["singles/_transcendence.mp3", "_Transcendence"],
      ["singles/ergo_empty.mp3", "Ergo Empty"],
      ["fote6/escape_velocity.mp3", "Escape Velocity"],
      ["fote6/only_rocket_science.mp3", "Only Rocket Science"],
      ["fote6/underground_plateau.mp3", "Underground Plateay"],
      ["fote6/dark_forest_hypothesis.mp3", "Dark Forest Hypothesis"],
      ["fote6/tidally_locked.mp3", "Tidally Locked"],
      ["fote6/Limbo.mp3", "Limbo"],
      ["fote6/sincerest_apologies,.mp3", "Sincerest Apologies,"],
      ["fote6/absolute_failure.mp3", "Absolute Failure"],
      ["fote6/when_we_were_friends.mp3", "When We Were Friends"],
      ["fote6/homesick_for_home.mp3", "Homesick For Home"],
      ["fote6/you're_a_murderer.mp3", "you're a murderer"],
      ["fote6/before_we_knew_it.mp3", "Before We Knew It"],
      ["singles/stalk.mp3", "Stalk"],
      ["eos/untitled_5_31_2mp4.mp3", "untitled_5_31_23"],
      ["singles/retrospect.mp3", "Retrospect"],
      ["eos/gnosienne.mp3", "Gnosienne"],
      [
        "eos/a_goodbye_to_someone_who_doesn't_exist_anymore.mp3",
        "a goodbye to someone who doesn't exist anymore",
      ],
      ["eos/all_the_little_things.mp3", "All The Little Things"],
      ["eos/moonlight.mp3", "Moonlight"],
      ["orbit/future.mp3", "future"],
      ["orbit/bliss.mp3", "bliss"],
      ["orbit/chiral.mp3", "chiral"],
      ["orbit/distorted_arp.mp3", "distorted_arp"],
      ["orbit/ww_ilude.mp3", "interlude"],
      ["orbit/catacombs.mp3", "catacombs"],
      ["orbit/later-vill_de_la_line.mp3", "ville de la lune"],
      ["orbit/wander.mp3", "wander"],
      ["orbit/dusk.mp3", "dusk"],
      ["website/jrpg_end.mp3", "JRPG End"],
      ["website/Birds.mp3", "birds/egodeath"],
      ["fote6/dark_forest_hypothesis.mp3", "Dark Forest Hypothesis"],
      [
        "eos/a_goodbye_to_someone_who_doesn't_exist_anymore.mp3",
        "a goodbye to someone who doesn't exist anymore",
      ],
      ["website/whole_heart.mp3", "Whole Heart"],
      ["website/after_the_end.mp3", "After the End"],
      ["website/poolside.mp3", "Poolside"],
    ] as [string, string][],
    orbit: [
      ["orbit/future.mp3", "future"],
      ["orbit/bliss.mp3", "bliss"],
      ["orbit/chiral.mp3", "chiral"],
      ["orbit/distorted_arp.mp3", "distorted_arp"],
      ["orbit/ww_ilude.mp3", "interlude"],
      ["orbit/catacombs.mp3", "catacombs"],
      ["orbit/later-vill_de_la_line.mp3", "ville de la lune"],
      ["orbit/wander.mp3", "wander"],
      ["orbit/dusk.mp3", "dusk"],
    ] as [string, string][],
    eos: [
      ["eos/gnosienne.mp3", "Gnosienne"],
      [
        "eos/a_goodbye_to_someone_who_doesn't_exist_anymore.mp3",
        "a goodbye to someone who doesn't exist anymore",
      ],
      ["eos/all_the_little_things.mp3", "All The Little Things"],
      ["eos/untitled_5_31_2mp4.mp3", "untitled_5_31_23"],
      ["eos/moonlight.mp3", "Moonlight"],
    ] as [string, string][],
    fote6: [
      ["fote6/escape_velocity.mp3", "Escape Velocity"],
      ["fote6/only_rocket_science.mp3", "Only Rocket Science"],
      ["fote6/underground_plateau.mp3", "Underground Plateay"],
      ["fote6/dark_forest_hypothesis.mp3", "Dark Forest Hypothesis"],
      ["fote6/tidally_locked.mp3", "Tidally Locked"],
      ["fote6/Limbo.mp3", "Limbo"],
      ["fote6/sincerest_apologies,.mp3", "Sincerest Apologies,"],
      ["fote6/absolute_failure.mp3", "Absolute Failure"],
      ["fote6/when_we_were_friends.mp3", "When We Were Friends"],
      ["fote6/homesick_for_home.mp3", "Homesick For Home"],
      ["fote6/you're_a_murderer.mp3", "you're a murderer"],
      ["fote6/before_we_knew_it.mp3", "Before We Knew It"],
    ] as [string, string][],
    singles: [
      [
        "singles/faded_horizons_(lost_to_time).mp3",
        "Faded Horizons (Lost to Time)",
      ],
      ["singles/ergo_empty.mp3", "Ergo Empty"],
      ["singles/stalk.mp3", "Stalk"],
      ["singles/_transcendence.mp3", "_Transcendence"],
      ["singles/wing_sauce.mp3", "Wing Sauce"],
      ["singles/retrospect.mp3", "Retrospect"],
    ] as [string, string][],
  };

  defaultState = {
    playlist: this.playlists.website,
    songIndex: 0,
    paused: false,
    seekPerformed: false,
    seekTime: 0,
    volume: 0.5,
  };

  constructor() {
    let self = this;
    // fill local storage with default values if not exist
    Object.entries(this.defaultState).forEach(([key, value]) => {
      if (
        !localStorage.getItem(key) ||
        localStorage.getItem(key) === "undefined"
      ) {
        localStorage.setItem(key, JSON.stringify(value));
      }
    });

    if (this.elements.volumeSlider) {
      const storedVolume = localStorage.getItem("volume");
      const difference: number =
        parseFloat(this.elements.volumeSlider.value) -
        parseFloat(storedVolume as string);
      difference >= 0
        ? this.elements.volumeSlider.stepDown(difference)
        : this.elements.volumeSlider.stepUp(-difference);
    }

    this.playlist = JSON.parse(localStorage.getItem("playlist") as string);
    this.songIndex = JSON.parse(localStorage.getItem("songIndex") as string);
    this.paused = JSON.parse(localStorage.getItem("paused") as string);

    this.seekTime = JSON.parse(localStorage.getItem("seekTime") as string);
    this.volume = JSON.parse(localStorage.getItem("volume") as string);
    // IMPORTANT, REPLACE SOURCE INSTEAD OF WHOLE MEDIA ELEM
    this.currentSong = new Audio(
      "/sitewide/apps/musicPlayer/songs/" + this.playlist[this.songIndex][0],
    );
    let song = this.currentSong;
    song.currentTime = this.seekTime;
    song.volume = this.volume;
    if (!this.paused) {
      song.autoplay = true;
      this.elements.songTitle.innerHTML = this.playlist[this.songIndex][1];
      this.elements.playbackButtonImage.src =
        "/sitewide/apps/musicPlayer/pause.png";
      this.currentSong.addEventListener(
        "loadedmetadata",
        () => {
          this.elements.seekSlider.max = String(this.currentSong.duration);
        },
        { once: true },
      );
    }
    this.songLength = 0;

    window.addEventListener(
      "click",
      () => {
        if (song.paused && !this.paused) {
          this.elements.playbackButtonImage.src =
            "/sitewide/apps/musicPlayer/pause.png";
          this.updateSong();
          song.currentTime = this.seekTime;
          song.play();
        }
      },
      { once: true },
    );

    this.elements.volumeSlider.oninput = (e: Event) => {
      let slider = e.target as HTMLInputElement;
      localStorage.setItem("volume", slider.value);
      song.volume = parseFloat(slider.value);
    };

    this.elements.seekSlider.onmouseup = (e: Event) => {
      let slider = e.target as HTMLInputElement;
      localStorage.setItem("seekTime", slider.value);
      song.currentTime = parseFloat(slider.value);
      self.seeking = false;
    };

    this.elements.seekSlider.onmousedown = function() {
      self.seeking = true;
    };

    song.ontimeupdate = (e: Event) => {
      let med = e.target as HTMLMediaElement;
      let slider = self.elements.seekSlider;
      localStorage.setItem("playlist", JSON.stringify(this.playlist));
      localStorage.setItem("songIndex", String(this.songIndex));
      localStorage.setItem("seekTime", String(song.currentTime));

      if (!this.seeking) slider.value = String(med.currentTime);
    };

    song.onended = () => {
      this.nextSong();
    };

    this.elements.nextSongButton.onclick = () => {
      this.nextSong();
    };
    this.elements.prevSongButton.onclick = () => {
      this.previousSong();
    };
    this.elements.playPauseButton.onclick = () => {
      this.playPause();
    };
  }

  updateSong() {
    this.currentSong.pause();
    this.currentSong.src =
      "/sitewide/apps/musicPlayer/songs/" + this.playlist[this.songIndex][0];
    this.currentSong.load();
    this.elements.songTitle.innerHTML = this.playlist[this.songIndex][1];
    this.currentSong.addEventListener(
      "loadedmetadata",
      () => {
        this.elements.seekSlider.max = String(this.currentSong.duration);
      },
      { once: true },
    );
  }

  nextSong() {
    this.songIndex =
      this.songIndex + 1 < this.playlist.length ? this.songIndex + 1 : 0;
    this.updateSong();
    this.currentSong.play();
    this.elements.playbackButtonImage.src =
      "/sitewide/apps/musicPlayer/pause.png";
  }
  previousSong() {
    this.songIndex =
      this.songIndex - 1 >= 0 ? this.songIndex - 1 : this.playlist.length - 1;
    this.updateSong();
    this.currentSong.play();
    this.elements.playbackButtonImage.src =
      "/sitewide/apps/musicPlayer/pause.png";
  }
  playPause() {
    if (!this.currentSong.paused) {
      this.elements.playbackButtonImage.src =
        "/sitewide/apps/musicPlayer/play.png";
      this.paused = true;
      localStorage.setItem("paused", "true");
      this.currentSong.pause();
    } else {
      this.elements.playbackButtonImage.src =
        "/sitewide/apps/musicPlayer/pause.png";
      this.currentSong.play();
      localStorage.setItem("paused", "false");
    }
  }
}

let player = new musicPlayer();

function changePlaylist(element: HTMLButtonElement, playlist: string) {
  const buttons: HTMLCollectionOf<HTMLButtonElement> = document
    .getElementById("playlistSelect")
    ?.getElementsByTagName("button") as HTMLCollectionOf<HTMLButtonElement>;

  Array.from(buttons).forEach((button: HTMLButtonElement) => {
    if (button.innerText.startsWith("> ")) {
      button.innerText = button.innerText.slice(2);
    }
  });

  element.innerText = "> " + element.innerText;
  let newPlaylist: [string, string][];

  switch (playlist) {
    case "website":
      newPlaylist = player.playlists.website;
      break;
    case "discography":
      newPlaylist = player.playlists.discography;
      break;
    case "orbit":
      newPlaylist = player.playlists.orbit;
      break;
    case "eos":
      newPlaylist = player.playlists.eos;
      break;
    case "fote6":
      newPlaylist = player.playlists.fote6;
      break;
    case "singles":
      newPlaylist = player.playlists.singles;
      break;

    default:
      newPlaylist = player.playlists.website;
  }
  localStorage.setItem("playlist", JSON.stringify(newPlaylist));
  localStorage.setItem("songIndex", "0");
  player.playlist = JSON.parse(localStorage.getItem("playlist") as string);
  player.songIndex = 0;
  player.updateSong();
  player.currentSong.play();
}
