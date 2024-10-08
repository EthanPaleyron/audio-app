const button = document.querySelector("#registration");

const time = document.querySelector("#time");
let min = 0;
let sec = 0;
let noRegisters = true;
let intervalId;

button.addEventListener("click", () => {
  if (noRegisters) {
    intervalId = setInterval(() => {
      sec++;
      if (sec === 60) {
        min++;
        sec = 0;
      }
      const formattedSec = String(sec).padStart(2, "0");
      const formattedMin = String(min).padStart(2, "0");
      time.textContent = `${formattedMin}:${formattedSec}`;
    }, 1000);
    noRegisters = false;
  } else {
    clearInterval(intervalId);
    noRegisters = true;
    time.textContent = "00:00";
    min = 0;
    sec = 0;
  }
});
