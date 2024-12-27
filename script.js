document.getElementById("nextButton").addEventListener("click", function() {
    const name = document.getElementById("name").value;
    const rollNumber = document.getElementById("rollNumber").value;
    const department = document.getElementById("department").value;
    const email = document.getElementById("email").value;
    const mobile = document.getElementById("mobile").value;
  
    // Validate email (college email)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@college\.edu$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid college email address.");
      return;
    }
  
    // Validate mobile number (10 digits)
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }
  
    // Check if all the required fields are filled
    if (name && rollNumber && department && email && mobile) {
      // Show the second part of the form (step 2)
      document.getElementById("step2").classList.remove("hidden");
    } else {
      alert("Please fill all fields in step 1.");
    }
  });
  
  // Handle form submission
  document.querySelector("form").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent default form submission
  
    const formData = new FormData(this); // Collect form data
  
    // Convert FormData to a regular object
    const data = {};
    formData.forEach((value, key) => {
      if (key === 'skills') {
        if (!data[key]) data[key] = [];
        data[key].push(value); // For skills, store as an array
      } else {
        data[key] = value;
      }
    });
  
    try {
      // Send the form data to the server
      const response = await fetch('/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      const result = await response.text();
      alert(result); // Display server response
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while submitting the form.");
    }
  });
  