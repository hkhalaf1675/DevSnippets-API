const express = require('express')
const app = express();
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config/config');
const { default: mongoose } = require('mongoose');
const { errorHandler } = require('./middlewares/global-error-handler.middleware');

//#region app configurations
app.use(cors({
    origin: config.allowOrigins?.split(','),
    optionsSuccessStatus: 200
}));

app.use(helmet());

app.use(morgan('dev'));

app.use(express.json());
//#endregion

//#region mongodb connection
(async () => {
    try {
        await mongoose.connect(config.mongodbUri);
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection error', err);
        process.exit(1);
    }
})();
//#endregion

//#region Routes
/* Auth Apis */
const authRoutes = require('./routes/auth.routes');
app.use('/auth', authRoutes);

/* User Routes */
const userRoutes = require('./routes/user.routes');
app.use('/users', userRoutes);

/* Welcome Api */ 
const welcomeRoute = require('./routes/index.route');
app.use('/', welcomeRoute);

//#endregion

//#region handlers
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
//#endregion

app.listen(config.port, (() => {
    console.log(`Server is running successfully at port ${config.port}`);
}));