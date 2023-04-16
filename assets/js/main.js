(function () {
  const second = 1000,
        minute = second * 60,
        hour = minute * 60,
        day = hour * 24;

  const countdownEl = document.getElementById("countdown");

  function showCountdown(distance) {
    document.getElementById("days").innerText = Math.floor(distance / day);
    document.getElementById("hours").innerText = Math.floor((distance % day) / hour);
    document.getElementById("minutes").innerText = Math.floor((distance % hour) / minute);
    document.getElementById("seconds").innerText = Math.floor((distance % minute) / second);
  }

  function showSaleEnded() {
    document.getElementById("countdown-headline").innerText = "The Sale is now Ended!";
    countdownEl.style.display = "none";
    document.getElementById("ctd-end-content").style.display = "block";
  }

  function startCountdown() {
    const countDownDate = new Date("May 27, 2024 00:00:00").getTime();

    const x = setInterval(function() {
      const now = new Date().getTime();
      const distance = countDownDate - now;

      if (distance < 0) {
        showSaleEnded();
        clearInterval(x);
      } else {
        showCountdown(distance);
      }
    }, second);
  }

  startCountdown();
})();



   