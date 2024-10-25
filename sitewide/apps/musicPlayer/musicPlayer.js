"use strict";
class musicPlayer {
    currentSong;
    playlist;
    songIndex;
    paused;
    seekTime;
    volume;
    songLength;
    seeking = false;
    elements = {
        playbackButtonImage: document.getElementById("musicPlayPause"),
        volumeSlider: document.getElementById("volumeSlider"),
        songTitle: document.getElementById("currentSong"),
        seekSlider: document.getElementById("seekSlider"),
        playPauseButton: document.getElementById("playPauseButton"),
        nextSongButton: document.getElementById("nextSongButton"),
        prevSongButton: document.getElementById("prevSongButton"),
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
        ],
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
        ],
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
        ],
        eos: [
            ["eos/gnosienne.mp3", "Gnosienne"],
            [
                "eos/a_goodbye_to_someone_who_doesn't_exist_anymore.mp3",
                "a goodbye to someone who doesn't exist anymore",
            ],
            ["eos/all_the_little_things.mp3", "All The Little Things"],
            ["eos/untitled_5_31_2mp4.mp3", "untitled_5_31_23"],
            ["eos/moonlight.mp3", "Moonlight"],
        ],
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
        ],
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
        ],
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
            if (!sessionStorage.getItem(key) ||
                sessionStorage.getItem(key) === "undefined") {
                sessionStorage.setItem(key, JSON.stringify(value));
            }
        });
        if (this.elements.volumeSlider) {
            const storedVolume = sessionStorage.getItem("volume");
            const difference = parseFloat(this.elements.volumeSlider.value) -
                parseFloat(storedVolume);
            difference >= 0
                ? this.elements.volumeSlider.stepDown(difference)
                : this.elements.volumeSlider.stepUp(-difference);
        }
        if (null !== localStorage.getItem("videoIndex") ||
            localStorage.getItem("videoIndex") !== "undefined") {
            localStorage.clear();
        }
        this.playlist = JSON.parse(sessionStorage.getItem("playlist"));
        this.songIndex = JSON.parse(sessionStorage.getItem("songIndex"));
        this.paused = JSON.parse(sessionStorage.getItem("paused"));
        this.seekTime = JSON.parse(sessionStorage.getItem("seekTime"));
        this.volume = JSON.parse(sessionStorage.getItem("volume"));
        // IMPORTANT, REPLACE SOURCE INSTEAD OF WHOLE MEDIA ELEM
        this.currentSong = new Audio("/sitewide/apps/musicPlayer/songs/" + this.playlist[this.songIndex][0]);
        let song = this.currentSong;
        song.currentTime = this.seekTime;
        song.volume = this.volume;
        if (!this.paused) {
            song.autoplay = true;
            this.elements.songTitle.innerHTML = this.playlist[this.songIndex][1];
            this.elements.playbackButtonImage.src =
                "/sitewide/apps/musicPlayer/pause.png";
            this.currentSong.addEventListener("loadedmetadata", () => {
                this.elements.seekSlider.max = String(this.currentSong.duration);
            }, { once: true });
        }
        this.songLength = 0;
        window.addEventListener("click", () => {
            if (song.paused && !this.paused) {
                this.elements.playbackButtonImage.src =
                    "/sitewide/apps/musicPlayer/pause.png";
                this.updateSong();
                song.currentTime = this.seekTime;
                song.play();
            }
        }, { once: true });
        this.elements.volumeSlider.oninput = (e) => {
            let slider = e.target;
            sessionStorage.setItem("volume", slider.value);
            song.volume = parseFloat(slider.value);
        };
        this.elements.seekSlider.onmouseup = (e) => {
            let slider = e.target;
            sessionStorage.setItem("seekTime", slider.value);
            song.currentTime = parseFloat(slider.value);
            self.seeking = false;
        };
        this.elements.seekSlider.onmousedown = function () {
            self.seeking = true;
        };
        song.ontimeupdate = (e) => {
            let med = e.target;
            let slider = self.elements.seekSlider;
            sessionStorage.setItem("playlist", JSON.stringify(this.playlist));
            sessionStorage.setItem("songIndex", String(this.songIndex));
            sessionStorage.setItem("seekTime", String(song.currentTime));
            if (!this.seeking)
                slider.value = String(med.currentTime);
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
        this.currentSong.addEventListener("loadedmetadata", () => {
            this.elements.seekSlider.max = String(this.currentSong.duration);
        }, { once: true });
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
            sessionStorage.setItem("paused", "true");
            this.currentSong.pause();
        }
        else {
            this.elements.playbackButtonImage.src =
                "/sitewide/apps/musicPlayer/pause.png";
            this.currentSong.play();
            sessionStorage.setItem("paused", "false");
        }
    }
}
let player = new musicPlayer();
function changePlaylist(element, playlist) {
    const buttons = document
        .getElementById("playlistSelect")
        ?.getElementsByTagName("button");
    Array.from(buttons).forEach((button) => {
        if (button.innerText.startsWith("> ")) {
            button.innerText = button.innerText.slice(2);
        }
    });
    element.innerText = "> " + element.innerText;
    let newPlaylist;
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
    sessionStorage.setItem("playlist", JSON.stringify(newPlaylist));
    sessionStorage.setItem("songIndex", "0");
    player.playlist = JSON.parse(sessionStorage.getItem("playlist"));
    player.songIndex = 0;
    player.updateSong();
    player.currentSong.play();
}
