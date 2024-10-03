const buttons = document.querySelectorAll(".playPause");
const mainPlayPause = document.querySelector("#mainPlayPause");
const mainProgress = document.querySelector("#mainProgress");
const mainIcon = document.querySelector("#mainIcon");
const mainName = document.querySelector("#mainName");
const mainAuthor = document.querySelector("#mainAuthor");
mainPlayPause.disabled = true;
let isPause = true;

// Global variable to keep track of the currently playing audio
let currentAudio;

buttons.forEach((button, i) => {
  const audio = document.querySelector(`audio[data-player="${i}"]`);
  const icon = document.querySelector(`img[data-player="${i}"]`);
  const currentTime = document.querySelector(
    `.currentTime[data-player="${i}"]`
  );
  const totalTime = document.querySelector(`.totalTime[data-player="${i}"]`);
  const progressBar = document.querySelector(`input[data-player="${i}"]`);

  audio.addEventListener("loadedmetadata", () => {
    // total time audio
    const time = formatTime(audio.duration);
    totalTime.textContent = time;
  });

  button.addEventListener("click", () => {
    if (mainPlayPause.disabled == true) {
      mainPlayPause.classList.add("btn-orange");
      mainPlayPause.classList.remove("btn-gray");
      mainPlayPause.disabled = false;
    }

    // Check if there's a different audio currently playing
    if (currentAudio != null) {
      if (currentAudio !== i) {
        const tmpAudio = document.querySelector(
          `audio[data-player="${currentAudio}"]`
        );
        const tmpIcon = document.querySelector(
          `img[data-player="${currentAudio}"]`
        );
        const tmpName = document.querySelector(
          `.nameAudio[data-player="${currentAudio}"]`
        );
        const tmpAuthor = document.querySelector(
          `.authorAudio[data-player="${currentAudio}"]`
        );

        mainName.textContent = tmpName.textContent;
        mainAuthor.textContent = tmpAuthor.textContent;

        // Pause the old audio and reset its time
        tmpAudio.pause();
        tmpAudio.currentTime = 0;
        tmpIcon.src = "public/icons/play-fill.svg";
        isPause = true;
      }
    } else {
      const tmpName = document.querySelector(`.nameAudio[data-player="${i}"]`);
      const tmpAuthor = document.querySelector(
        `.authorAudio[data-player="${i}"]`
      );

      mainName.textContent = tmpName.textContent;
      mainAuthor.textContent = tmpAuthor.textContent;
    }

    if (isPause) {
      // play and pause audio
      audio.play();
      icon.src = "public/icons/pause-fill.svg";
      mainIcon.src = "public/icons/pause-fill.svg";
      isPause = false;
    } else {
      audio.pause();
      icon.src = "public/icons/play-fill.svg";
      mainIcon.src = "public/icons/play-fill.svg";
      isPause = true;
    }

    currentAudio = i;
  });

  audio.addEventListener("timeupdate", () => {
    // current time audio
    currentTime.textContent = formatTime(audio.currentTime);
    // update progress
    progressBar.value = (audio.currentTime / audio.duration) * 100;
    mainProgress.value = (audio.currentTime / audio.duration) * 100;
  });

  progressBar.addEventListener("input", () => {
    const progress = parseFloat(progressBar.value);
    const newTime = (progress / 100) * audio.duration;
    audio.currentTime = newTime;
  });
});

mainPlayPause.addEventListener("click", () => {
  const audio = document.querySelector(`audio[data-player="${currentAudio}"]`);
  const icon = document.querySelector(`img[data-player="${currentAudio}"]`);
  if (isPause) {
    // play and pause audio
    audio.play();
    icon.src = "public/icons/pause-fill.svg";
    mainIcon.src = "public/icons/pause-fill.svg";
    isPause = false;
  } else {
    audio.pause();
    icon.src = "public/icons/play-fill.svg";
    mainIcon.src = "public/icons/play-fill.svg";
    isPause = true;
  }
});

mainProgress.addEventListener("input", () => {
  const audio = document.querySelector(`audio[data-player="${currentAudio}"]`);
  const progress = parseFloat(mainProgress.value);
  const newTime = (progress / 100) * audio.duration;
  audio.currentTime = newTime;
});

function formatTime(s) {
  const min = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${min} min ${sec < 10 ? "0" : ""}${sec} sec`;
}
