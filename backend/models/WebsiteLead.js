// models/WebsiteLead.js

import mongoose from 'mongoose';

const LeadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true 
    },
    phone: {
        type: String,
        trim: true
    },
    selectedLocation: {
        type: String,
        trim: true
    },
    otherLocation: {
        type: String,
        trim: true
    },
    selectedLayout: {
        type: String,
        trim: true
    },
    otherLayout: {
        type: String,
        trim: true
    }
}, { timestamps: true }); // timestamps: true adds createdAt and updatedAt

const WebsiteLead = mongoose.model('waitlist_leads', LeadSchema);

export default WebsiteLead;