const express = require('express')
const app = express();
const cors = require('cors');
const config = require('./config/config');
const { default: mongoose } = require('mongoose');
const { errorHandler } = require('./middlewares/global-error-handler.middleware');

app.use(cors({
    origin: config.allowOrigins?.split(','),
    optionsSuccessStatus: 200
}));

/* mongodb connection */
mongoose.connect(config.mongodbUri)
    .then(() => console.log('Mongodb has been connected successfully'))
    .catch((error) => console.error('Mongodb connection error', error));

/* Welcome Api */ 
app.get('/', (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'Dev Snippets Apis'
    });
});

/* handle APIs not found */
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Can not find ${req.originalUrl}`
    });
});

/* Global Error handler */
app.use(errorHandler);


app.listen(config.port, (() => {
    console.log(`Server is running successfully at port ${config.port}`);
}));