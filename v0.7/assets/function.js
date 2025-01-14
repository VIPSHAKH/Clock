// Get the hour, minute, and second hand elements from the DOM
let hr = document.querySelector("#hr");
let mn = document.querySelector("#mn");
let sc = document.querySelector("#sc");

// Rotate the clock hands based on the current time
setInterval(() => {
  // Get the current date and time
  let day = new Date();

  // Calculate the degrees to rotate the clock hands
  let hh = day.getHours() * 30; // 360 / 12 = 30
  let mm = day.getMinutes() * 6; // 360 / 60 = 6
  let ss = day.getSeconds() * 6; // 360 / 60 = 6

  // Rotate the hour, minute, and second hands using CSS transform
  hr.style.transform = `rotateZ(${hh + mm / 12}deg)`;
  mn.style.transform = `rotateZ(${mm}deg)`;
  sc.style.transform = `rotateZ(${ss}deg)`;

  // Get the digital clock elements from the DOM
  let hours = document.getElementById("hours");
  let minutes = document.getElementById("minutes");
  let seconds = document.getElementById("seconds");
  let ampm = document.getElementById("ampm");

  // Get the current hour, minute, and second
  let h = new Date().getHours();
  let m = new Date().getMinutes();
  let s = new Date().getSeconds();

  // Add leading zeros to single-digit minutes and seconds
  m = (m < 10 ? "0" : "") + m;
  s = (s < 10 ? "0" : "") + s;

  // Determine whether the time is AM or PM
  let amOrPm = h < 12 ? "AM" : "PM";

  // Convert 24-hour time to 12-hour time
  h = h % 12 || 12;

  // Update the HTML elements with the current time
  hours.innerHTML = h;
  minutes.innerHTML = m;
  seconds.innerHTML = s;
  ampm.innerHTML = amOrPm;
});
