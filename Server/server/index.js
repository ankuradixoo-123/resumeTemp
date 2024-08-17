const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Route to handle form submission
app.post('/api/submit-resume', (req, res) => {
    const resumeData = req.body;
    console.log('Received resume data:', resumeData);
    res.json({ success: true, data: resumeData });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
