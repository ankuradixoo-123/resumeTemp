const express = require('express');
const cors = require('cors');
const pgp = require('pg-promise')();

// Initialize Express app
const app = express();
const port = 5000; // or your preferred port

// Enable CORS
app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());

// Set up your PostgreSQL connection
const db = pgp('postgres://postgres:Ankur@2002@localhost:5432/resume_db');

// Function to save resume data
const saveResumeData = async (resumeData) => {
    try {
        await db.none(
            'INSERT INTO resumes(name, objective, experience, projects, education) VALUES($1, $2, $3, $4, $5)', 
            [
                resumeData.name,
                resumeData.objective,
                JSON.stringify(resumeData.experience), // Convert experience to JSON string
                JSON.stringify(resumeData.projects), // Convert projects to JSON string
                JSON.stringify(resumeData.education) // Convert education to JSON string
            ]
        );
        console.log('Resume data saved successfully');
    } catch (error) {
        console.error('Error saving resume data:', error);
    }
};

// Define your API route for submitting resume data
app.post('/api/submit-resume', async (req, res) => {
    const resumeData = req.body;

    try {
        await saveResumeData(resumeData);
        res.status(200).send('Resume data saved successfully');
    } catch (error) {
        console.error('Error saving resume data:', error);
        res.status(500).send('Error saving resume data');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
