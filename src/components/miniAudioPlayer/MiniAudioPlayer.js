import cssText from "./miniaudioplayer.scss?inline";

class MiniAudioPlayer extends HTMLElement {
  static sheet;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.isPaused = true;
    this.applyStyles();
    // Render component
    this.render();
  }

  applyStyles() {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(cssText.toString());
    this.shadowRoot.adoptedStyleSheets = [sheet];
  }

  connectedCallback() {
    // Get attributes
    this.trackSrc = this.getAttribute("src");
    this.trackName = this.getAttribute("name");
    this.trackAuthor = this.getAttribute("author");
    this.playerIndex = this.getAttribute("data-player");

    // Setup event listeners
    this.setupEventListeners();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <article class="player" data-index="${this.playerIndex}">
        <img src="Image.png" alt="image">
        <div class="player__content_progress">
          <div class="player__content">
            <div class="player__content__infos">
              <div>
                <h2 class="nameAudio" data-player="${this.playerIndex}">${this.trackName}</h2>
                <p class="authorAudio" data-player="${this.playerIndex}">${this.trackAuthor}</p>
              </div>
              <p>
                <span class="currentTime" data-player="${this.playerIndex}">0 min 00 sec</span> of
                <span class="totalTime" data-player="${this.playerIndex}">--:--</span>
              </p>
            </div>
            <div class="player__content__interaction">
              <button class="favorit-lw">
                <img src="icons/heart.svg" alt="heart" class="icon">
              </button>
              <button class="btn-orange playPause" data-player="${this.playerIndex}">
                <img src="icons/play-fill.svg" alt="play" class="icon" data-player="${this.playerIndex}">
              </button>
            </div>
          </div>
          <input type="range" class="progress" value="0" data-player="${this.playerIndex}">
        </div>
        <audio data-player="${this.playerIndex}">
          <source src="${this.trackSrc}" type="audio/mpeg">
          Your browser does not support the audio element.
        </audio>
      </article>
    `;
  }

  setupEventListeners() {
    const shadow = this.shadowRoot;
    const playPauseButton = shadow.querySelector(".playPause");
    const audio = shadow.querySelector(
      `audio[data-player="${this.playerIndex}"]`
    );
    const icon = playPauseButton.querySelector(
      `img[data-player="${this.playerIndex}"]`
    );
    const currentTimeElem = shadow.querySelector(
      `.currentTime[data-player="${this.playerIndex}"]`
    );
    const totalTimeElem = shadow.querySelector(
      `.totalTime[data-player="${this.playerIndex}"]`
    );
    const progressBar = shadow.querySelector(
      `input.progress[data-player="${this.playerIndex}"]`
    );

    audio.addEventListener("loadedmetadata", () => {
      const time = this.formatTime(audio.duration);
      totalTimeElem.textContent = time;
    });

    playPauseButton.addEventListener("click", () => {
      // Dispatch a custom event to inform the main player
      this.dispatchEvent(
        new CustomEvent("track-selected", {
          detail: {
            src: this.trackSrc,
            name: this.trackName,
            author: this.trackAuthor,
            index: this.playerIndex,
            action: this.isPaused ? "play" : "pause",
          },
          bubbles: true,
          composed: true,
        })
      );
    });

    audio.addEventListener("timeupdate", () => {
      currentTimeElem.textContent = this.formatTime(audio.currentTime);
      progressBar.value = (audio.currentTime / audio.duration) * 100;
    });

    progressBar.addEventListener("input", () => {
      audio.currentTime = (progressBar.value / 100) * audio.duration;
    });

    // Listen for play/pause commands from the main player
    this.addEventListener("play-pause", (event) => {
      if (event.detail.index === this.playerIndex) {
        if (event.detail.action === "play") {
          audio.play();
          icon.src = "icons/pause-fill.svg";
          this.isPaused = false;
        } else if (event.detail.action === "pause") {
          audio.pause();
          icon.src = "icons/play-fill.svg";
          this.isPaused = true;
        }
      } else {
        // Pause if another track is played
        audio.pause();
        audio.currentTime = 0;
        icon.src = "icons/play-fill.svg";
        this.isPaused = true;
      }
    });
  }

  formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min} min ${sec < 10 ? "0" : ""}${sec} sec`;
  }
}

customElements.define("mini-audio-player", MiniAudioPlayer);
