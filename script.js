// Set the date we're counting down to
var countDownDate = new Date("April 12, 2024 00:00:00").getTime();

// Update the count down every 1 second
var x = setInterval(function () {
  // Get the current date and time
  var now = new Date().getTime();

  // Find the distance between now and the count down date
  var distance = countDownDate - now;

  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Output the result in the countdown element
  var countdownElement = document.getElementById("countdown");
  countdownElement.innerHTML = `
        <div>
            <h1>${days}</h1>
            <h1 class="text-xs md:text-sm">DAYS</h1>
        </div>
        <div>
            <h1>${hours}</h1>
            <h1 class="text-xs md:text-sm">HOURS</h1>
        </div>
        <div>
            <h1>${minutes}</h1>
            <h1 class="text-xs md:text-sm">MINS</h1>
        </div>
        <div>
            <h1>${seconds}</h1>
            <h1 class="text-xs md:text-sm">SECS</h1>
        </div>
    `;

  // If the count down is over, write some text
  if (distance < 0) {
    clearInterval(x);
    countdownElement.innerHTML = "EXPIRED";
  }
}, 1000);
