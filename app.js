const express = require('express')
const app = express();
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config/config');
const { default: mongoose } = require('mongoose');
const { errorHandler } = require('./middlewares/global-error-handler.middleware');

app.use(cors({
    origin: config.allowOrigins?.split(','),
    optionsSuccessStatus: 200
}));

app.use(helmet());

app.use(morgan('dev'));

/* mongodb connection */
(async () => {
    try {
        await mongoose.connect(config.mongodbUri);
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection error', err);
        process.exit(1);
    }
})();

/* routes */

/* Welcome Api */ 
const welcomeRoute = require('./routes/index.route');
app.use('/', welcomeRoute);

/* handle APIs not found */
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'API Not Found',
        errors: [`Can not find ${req.originalUrl}`]
    });
});

/* Global Error handler */
app.use(errorHandler);


app.listen(config.port, (() => {
    console.log(`Server is running successfully at port ${config.port}`);
}));