// server.js

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config(); 


import WebsiteLead from './models/WebsiteLead.js';

// --- Configuration ---
const PORT = process.env.PORT || 5000;
const mongoURI = process.env.MONGO_URI; 

// --- Database Connection ---
mongoose.connect(mongoURI, {
  dbName: 'website_forms'
})
.then(() => console.log("MongoDB connected successfully to website_forms"))
.catch(err => {
    console.error("MongoDB connection error:", err.message);
    // Exit process on connection failure
    process.exit(1); 
});

const app = express();

// --- Middleware ---
app.use(cors()); // Allow cross-origin requests from your HTML site
app.use(express.json()); // To parse application/json
app.use(express.urlencoded({ extended: true })); // To parse form data (application/x-www-form-urlencoded)

// Serve the static HTML/CSS files from the 'public' folder
app.use(express.static('public')); 

// ADD THIS HEALTH CHECK BACK (Good practice and might be needed)
app.get('/health', (req, res) => {
    res.status(200).send({ status: 'OK', message: 'Service is active' });
});

// --- Lead Submission Route ---
app.get('/api/leads', async (req, res) => {
    // 1. Basic Security Check: Check for API Key in the URL Query
    const providedKey = req.query.key;
    if (!providedKey || providedKey !== process.env.ADMIN_API_KEY) {
        // Return a Forbidden status if the key is missing or incorrect
        return res.status(403).json({ 
            success: false, 
            message: 'Access Denied: Invalid API Key.' 
        });
    }

    try {
        // 2. Fetch all leads, ordered by newest first
        const leads = await WebsiteLead.find()
            .sort({ createdAt: -1 }) // Sort newest leads first
            .select('-__v')          // Exclude the Mongoose version field
            .lean();                 // Return plain JavaScript objects

        // 3. Send the leads back as JSON
        res.status(200).json({
            success: true,
            count: leads.length,
            leads: leads
        });

    } catch (error) {
        console.error('Error fetching leads:', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Server error while retrieving leads.' 
        });
    }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});