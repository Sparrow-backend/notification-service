const express = require('express');
const cors = require('cors');

const notificationRouter = require('./routes/notification/notification.router');
const notificationPreferenceRouter = require('./routes/notificationPreference/notificationPreference.router');

const app = express();

app.use(cors({
    origin: [
        'https://sparrow.nivakaran.dev',
        'http://localhost:3000',
        'http://nivakaran.dev'
    ]
}));

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: "Sparrow: Notification Service" });
});

app.get('/health', (req, res) => {
    res.json({ message: "Notification Service is running.." });
});

// API Routes
app.use('/api/notifications', notificationRouter);
app.use('/api/preferences', notificationPreferenceRouter);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found'
    });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error'
    });
});

module.exports = app;