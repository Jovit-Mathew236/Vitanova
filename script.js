import { initializeApp } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.12.1/firebase-firestore.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js";

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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // Initialize Firebase Authentication

// Function to handle form submission
const handleFormSubmission = (event) => {
  event.preventDefault(); // Prevent default form submission behavior

  // Get form data
  const formData = new FormData(event.target);
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
        // Validate year format (should be a number between 1 and 4)
        const year = parseInt(value);
        if (isNaN(year) || year < 1 || year > 4) {
          showError(key, "Please enter a valid year (1 to 4).");
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
  addDoc(collection(db, "registrations"), formObject)
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
      alert(`Hello ${formObject.name} You are registered`);
      // Reset form after successful submission
      event.target.reset();
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
};

// Attach event listener to form submission
document.addEventListener("DOMContentLoaded", () => {
  const registrationForm = document.getElementById("registrationForm");
  if (registrationForm) {
    registrationForm.addEventListener("submit", handleFormSubmission);
  } else {
    console.error("Registration form element not found.");
  }
});

// Function to display error messages
function showError(field, message) {
  const errorElement = document.createElement("div");
  errorElement.classList.add("text-red-500", "text-sm", "mt-1");
  errorElement.textContent = message;

  const inputField = document.getElementById(field);
  inputField.parentNode.appendChild(errorElement);
}

// Function to handle Google sign-in
// Function to handle Google sign-in
function googleSignIn() {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      // Check the email address before redirecting
      const userEmail = result.user.email;
      console.log("User email:", userEmail);
      const allowedEmails = [
        "jovitmathew236@gmail.com",
        "jovitmathew236632@gmail.com",
      ];
      if (allowedEmails.includes(userEmail)) {
        // Redirect to the admin page after successful login
        window.location.href = "admin.html";
      } else {
        // Redirect to unauthorized page if email is not allowed
        alert("You are not authorized to access this page.");
        auth.signOut();
        window.location.href = "login.html";
      }
    })
    .catch((error) => {
      // Handle errors here.
      console.error(error.code, error.message);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginbtn");
  if (loginBtn) {
    loginBtn.addEventListener("click", googleSignIn);
  } else {
    console.error("Login button not found.");
  }

  // Fetch data only if the user is logged in and on the admin page
  auth.onAuthStateChanged((user) => {
    if (
      user &&
      (window.location.pathname === "/admin" ||
        window.location.pathname === "/admin.html")
    ) {
      fetchData();
    } else if (
      !user &&
      (window.location.pathname === "/admin" ||
        window.location.pathname === "/admin.html")
    ) {
      // Redirect to login page if user is not logged in
      window.location.href = "login.html";
    }
  });
});
// Add this code to your script.js file

document.addEventListener("DOMContentLoaded", () => {
  const signOutBtn = document.getElementById("signOutBtn");
  if (signOutBtn) {
    signOutBtn.addEventListener("click", () => {
      auth
        .signOut()
        .then(() => {
          // Redirect to login page after sign-out
          window.location.href = "login.html";
        })
        .catch((error) => {
          console.error("Sign out error:", error);
        });
    });
  } else {
    console.error("Sign out button not found.");
  }
});

// Function to fetch data from Firestore and populate the table
const fetchData = () => {
  console.log("Fetching data...");
  getDocs(collection(db, "registrations"))
    .then((querySnapshot) => {
      const tableBody = document.getElementById("tableBody");
      tableBody.innerHTML = ""; // Clear existing table content
      let serialNumber = 1; // Initialize the serial number counter

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const row = `
          <tr>
              <td class="px-6 py-4 whitespace-nowrap">${serialNumber}</td>
              <td class="px-6 py-4 whitespace-nowrap">${data.name}</td>
              <td class="px-6 py-4 whitespace-nowrap">${data.contact_number}</td>
              <td class="px-6 py-4 whitespace-nowrap">${data.whatsapp_number}</td>
              <td class="px-6 py-4 whitespace-nowrap">${data.dob}</td>
              <td class="px-6 py-4 whitespace-nowrap">${data.year}</td>
              <td class="px-6 py-4 whitespace-nowrap">${data.branch}</td>
              <td class="px-6 py-4 whitespace-nowrap">${data.batch}</td>
              <td class="px-6 py-4 whitespace-nowrap">${data.hosteler}</td>
              <td class="px-6 py-4 whitespace-nowrap">${data.diet_preference}</td>
          </tr>
        `;
        tableBody.innerHTML += row;
        serialNumber++; // Increment the serial number for the next row
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
};

// Automatically fetch data when the window loads
// window.onload = fetchData;

// Slideshow functions...

var slideIndex = 0;
showSlides();

function showSlides() {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > slides.length) {
    slideIndex = 1;
  }
  slides[slideIndex - 1].style.display = "block";
  setTimeout(showSlides, 5000); // Change slide every 2 seconds
}

showSlides1();
function showSlides1() {
  var slideIndex = 0;
  var i;
  var slides = document.getElementsByClassName("mySlides1");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > slides.length) {
    slideIndex = 1;
  }
  slides[slideIndex - 1].style.display = "block";
  setTimeout(showSlides, 5000); // Change slide every 2 seconds
}
