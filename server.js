require("dotenv").config(); // Load environment variables from .env

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
app.use(express.json()); // For parsing JSON request bodies
app.use(express.urlencoded({ extended: true })); // For parsing URL-encoded bodies

// Serve static files from the current directory (for CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname)));

// MongoDB connection using environment variable
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error("MONGO_URI is not defined in the .env file. Please add it.");
  process.exit(1); // Exit the application if MONGO_URI is missing
}

mongoose
  .connect(mongoUri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1); // Exit the application if MongoDB connection fails
  });

// Define the schema and model
const registrationSchema = new mongoose.Schema({
  name: String,
  rollNumber: String,
  department: String,
  email: String,
  mobile: String,
  lab: String,
  skills: [String],
});

const Registration = mongoose.model("Registration", registrationSchema);

// Serve HTML (form.html)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "form.html"));
});

// Handle form submission
app.post("/submit", async (req, res) => {
  const { name, rollNumber, department, email, mobile, lab, skills } = req.body;

  try {
    console.log("Received form data:", req.body); // Log received data for debugging

    // Check if the email is a valid college email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@kingcollege\.ac\.in$/;
    if (!emailRegex.test(email)) {
      return res.status(400).send("Please enter a valid college email address.");
    }

    // Check if the mobile number has exactly 10 digits
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile)) {
      return res.status(400).send("Please enter a valid 10-digit mobile number.");
    }

    // Check if the lab is already full for the department
    const count = await Registration.countDocuments({ department, lab });
    if (count >= 3) {
      return res.status(400).send(`${lab} is already full for the ${department} department.`);
    }

    // Create a new registration
    const registration = new Registration({
      name,
      rollNumber,
      department,
      email,
      mobile,
      lab,
      skills, // Directly store the skills array
    });

    await registration.save();
    res.send("Your form has been submitted successfully!");
  } catch (error) {
    console.error("Error occurred while submitting:", error); // Log any error
    res.status(500).send("An error occurred while submitting the form.");
  }
});

// Start the server
const PORT = process.env.PORT || 3000; // Use environment variable PORT or fallback to 3000
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
