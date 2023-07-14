const newrelic = require('newrelic');
const config = require("./config/config.json");
const express = require('express');
const cron = require('node-cron');
const pool = require('./core/database');
const { generateToken, verifyToken } = require("./core/auth");
const logger = require('./core/logger');
const cors = require('cors');
const requestMiddleware = require('./core/requestMiddleware');
const app = express();
app.use(express.json())
app.use(cors());
app.use(requestMiddleware);

require('./config/dependency.js')(app);


app.get('/getToken', (req, res) => {
    try {
        const payload = {
            userId: 123,
            username: 'example_user'
        };
        const token = generateToken(payload);
        res.send(token);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/protected', verifyToken, (req, res) => {
    res.json({ message: 'Protected route', user: req.user });
});




//cron job to print data in table every hour
cron.schedule('0 0 * * *', () => {
    pool.query('SELECT * FROM registration', (error, results) => {
        if (error) throw error;

        console.log('Available Data:');
        console.log(results);
    });
});





app.listen(config.ports.appPort, () => {
    logger.info(`[serverUpdate] Server listening on port: ${config.ports.appPort}`);
    console.log(`Server listening on port: ${config.ports.appPort}`);
})