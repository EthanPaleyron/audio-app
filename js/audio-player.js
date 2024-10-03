const buttons = document.querySelectorAll(".playPause");
let isPause = true;

// Global variable to keep track of the currently playing audio
let tmp;

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
    // Check if there's a different audio currently playing
    if (tmp != null) {
      if (tmp !== i) {
        const tmpAudio = document.querySelector(`audio[data-player="${tmp}"]`);
        const tmpIcon = document.querySelector(`img[data-player="${tmp}"]`);

        // Pause the old audio and reset its time
        tmpAudio.pause();
        tmpAudio.currentTime = 0;
        tmpIcon.src = "public/icons/play-fill.svg";
        isPause = true;
      }
    }
    tmp = i;
    if (isPause) {
      // play and pause audio
      audio.play();
      icon.src = "public/icons/pause-fill.svg";
      isPause = false;
    } else {
      audio.pause();
      icon.src = "public/icons/play-fill.svg";
      isPause = true;
    }
  });

  audio.addEventListener("timeupdate", () => {
    // current time audio
    currentTime.textContent = formatTime(audio.currentTime);
    // update progress
    progressBar.value = (audio.currentTime / audio.duration) * 100;
  });

  progressBar.addEventListener("input", () => {
    const progress = parseFloat(progressBar.value);
    const newTime = (progress / 100) * audio.duration;
    audio.currentTime = newTime;
  });
});

function formatTime(s) {
  const min = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${min} min ${sec < 10 ? "0" : ""}${sec} sec`;
}
