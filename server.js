require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn.js');
const path = require('path');
const express = require('express');
const app = express();
const cors = require('cors');
const { logger } = require('./middleware/logEvents.js');
const errorHandler = require('./middleware/ErrorHandler.js');
const corsOptions = require('./config/corsOptions.js');
const verifyJwt = require('./middleware/verifyJwt.js');
const cookieParser = require('cookie-parser');
const { connect } = require('http2');
const PORT = process.env.PORT || 3500;

// connect to Mongodb
connectDB();
//custom middleware logger
app.use(logger);
// Cross Origin Resource Sharing
// Third party middleware
app.use(cors(corsOptions));
// built-in middleware to handle urlencoded data: form data
app.use(express.urlencoded({ encoded: false}));
// built-in middleware for json
app.use(express.json());
// middleware for parser
app.use(cookieParser());
// serves static files
app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/subdir', express.static(path.join(__dirname, '/public')));

// routes
app.use('/', require('./routes/root.js'));
app.use('/subdir', require('./routes/subdir.js'));
app.use('/register', require('./routes/api/register.js'));
app.use('/login', require('./routes/api/login.js'));
app.use('/refresh', require('./routes/api/refresh.js'));
app.use('/logout', require('./routes/api/logout.js'));

app.use(verifyJwt);
app.use('/employees', require('./routes/api/employees.js'));
// Route Handlers
app.get('/hello(.html)?', (req, res, next) => {
    console.log('Tried to send hello.html');
    next()
}, (req, res) => {
    res.send('Hello .html!!');
});

app.all('*', (req, res) => {
    res.status(404);
    if(req.accepts("html")){
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    }else if(req.accepts("json")){
        res.send({ error : "404 Not found"});
    }else{
        res.send("404 Not found");
    }
})

app.use(errorHandler);

mongoose.connection.once('open', () =>{
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
})