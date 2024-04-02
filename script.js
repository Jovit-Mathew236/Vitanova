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

// Paste your Firebase config here
const firebaseConfig = {
  apiKey: "AIzaSyBQM9WdQMXquTgBNiHpJ9ttbUHnqypPyNk",
  authDomain: "vitanova-c3e19.firebaseapp.com",
  projectId: "vitanova-c3e19",
  storageBucket: "vitanova-c3e19.appspot.com",
  messagingSenderId: "790838304210",
  appId: "1:790838304210:web:83846f96a276650d7cbc0b",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();
document
  .getElementById("registrationForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission behavior

    // Get form data
    const formData = new FormData(this);
    const formObject = {};
    let hasErrors = false; // Flag to track if there are any validation errors

    // Validation and data type correction for each form field
    formData.forEach((value, key) => {
      // Perform validation and data type correction for each field
      switch (key) {
        case "contact_number":
        case "whatsapp_number":
          // Validate phone numbers
          if (!/^\d{10}$/.test(value)) {
            showError(key, "Please enter a valid phone number with 10 digits.");
            hasErrors = true;
          }
          break;
        case "year":
          // Validate year format (should be a number)
          if (!/^\d{4}$/.test(value)) {
            showError(key, "Please enter a valid year (e.g., 2022).");
            hasErrors = true;
          }
          break;
        // Add more validation cases for other fields as needed
        default:
          // No specific validation for other fields
          break;
      }
      // Store corrected values in the form object
      formObject[key] = value;
    });

    // If there are validation errors, stop form submission
    if (hasErrors) {
      return;
    }

    // Store form data in Firestore
    db.collection("registrations")
      .add(formObject)
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
        // Reset form after successful submission
        this.reset();
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  });

// Function to display error messages
function showError(field, message) {
  const errorElement = document.createElement("div");
  errorElement.classList.add("text-red-500", "text-sm", "mt-1");
  errorElement.textContent = message;

  const inputField = document.getElementById(field);
  inputField.parentNode.appendChild(errorElement);
}
