class MainAudioPlayer extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.currentTrack = null;
      this.isPaused = true;
    }

    connectedCallback() {
      this.render();
      this.setupEventListeners();
    }

    render() {
      this.shadowRoot.innerHTML = `
        <article class="main-player">
          <img src="Image.png" alt="image" class="main-player__image">
          <div class="main-player__content_progress">
            <div class="main-player__content">
              <div class="main-player__content__infos">
                <h2 id="mainName">Select a track</h2>
                <p id="mainAuthor">Author</p>
              </div>
              <div class="main-player__content__main-interaction">
                <button id="prevButton">
                  <img src="icons/prev.svg" alt="previous">
                </button>
                <button class="btn-gray" id="mainPlayPause" disabled>
                  <img src="icons/play-fill.svg" alt="play" class="icon" id="mainIcon">
                </button>
                <button id="nextButton">
                  <img src="icons/next.svg" alt="next">
                </button>
              </div>
              <div class="main-player__content__interaction">
                <button>
                  <img src="icons/heart.svg" alt="heart" class="icon">
                </button>
                <button>
                  <img src="icons/plus-circle.svg" alt="favorite" class="icon">
                </button>
                <button>
                  <img src="icons/speaker.svg" alt="volume" class="icon">
                </button>
                <input type="range" class="progress" value="50">
              </div>
            </div>
            <input type="range" class="progress progressAudio" value="0" id="mainProgress">
          </div>
          <audio id="mainAudio">
            <source src="" type="audio/mpeg">
            Your browser does not support the audio element.
          </audio>
        </article>
        <style>
          /* Add styles specific to main player */
        </style>
      `;
    }

    setupEventListeners() {
      const shadow = this.shadowRoot;
      const mainPlayPause = shadow.querySelector('#mainPlayPause');
      const mainProgress = shadow.querySelector('#mainProgress');
      const mainIcon = shadow.querySelector('#mainIcon');
      const mainName = shadow.querySelector('#mainName');
      const mainAuthor = shadow.querySelector('#mainAuthor');
      const mainAudio = shadow.querySelector('#mainAudio');

      // Enable play/pause when a track is selected
      document.addEventListener('track-selected', (event) => {
        const { src, name, author, index, action } = event.detail;

        // Update current track
        this.currentTrack = { src, name, author, index };
        mainName.textContent = name;
        mainAuthor.textContent = author;
        mainAudio.src = src;

        // Enable play/pause button
        mainPlayPause.disabled = false;
        mainPlayPause.classList.remove('btn-gray');
        mainPlayPause.classList.add('btn-orange');

        // Play or pause based on action
        if (action === 'play') {
          this.playTrack();
        } else {
          this.pauseTrack();
        }

        // Notify mini players
        this.notifyMiniPlayers(index, action);
      });

      // Play/pause button event
      mainPlayPause.addEventListener('click', () => {
        if (this.isPaused) {
          this.playTrack();
        } else {
          this.pauseTrack();
        }

        // Notify mini players
        this.notifyMiniPlayers(this.currentTrack.index, this.isPaused ? 'pause' : 'play');
      });

      // Update progress bar
      mainAudio.addEventListener('timeupdate', () => {
        mainProgress.value = (mainAudio.currentTime / mainAudio.duration) * 100;
      });

      mainProgress.addEventListener('input', () => {
        mainAudio.currentTime = (mainProgress.value / 100) * mainAudio.duration;
      });
    }

    playTrack() {
      const shadow = this.shadowRoot;
      const mainIcon = shadow.querySelector('#mainIcon');
      const mainAudio = shadow.querySelector('#mainAudio');

      mainAudio.play();
      mainIcon.src = 'icons/pause-fill.svg';
      this.isPaused = false;
    }

    pauseTrack() {
      const shadow = this.shadowRoot;
      const mainIcon = shadow.querySelector('#mainIcon');
      const mainAudio = shadow.querySelector('#mainAudio');

      mainAudio.pause();
      mainIcon.src = 'icons/play-fill.svg';
      this.isPaused = true;
    }

    notifyMiniPlayers(index, action) {
      // Dispatch an event to all mini players
      document.querySelectorAll('mini-audio-player').forEach((miniPlayer) => {
        miniPlayer.dispatchEvent(new CustomEvent('play-pause', {
          detail: { index, action },
          bubbles: true,
          composed: true,
        }));
      });
    }
  }

  customElements.define('main-audio-player', MainAudioPlayer);