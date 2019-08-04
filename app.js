require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const cors         = require('cors');
const passport     = require('passport');
const session      = require('express-session');


require('./config/passport');

mongoose
  .connect('mongodb://localhost/project-3-backend', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



app.use(session({
  secret:"secret",
  resave: true,
  saveUninitialized: true
}));



app.use(passport.initialize());
app.use(passport.session());


app.use(cors({
  credentials: true,
    // comment when deployed:
  origin: ['http://localhost:3000']
    // change 'blah' and uncomment when deployed:
    // origin: ['http://localhost:3000', 'https://blah.herokuapp.com']

}));

// default value for title local
app.locals.title = 'Kukee Bliss Yoga';



const index = require('./routes/index');
app.use('/', index);

const asanaRoutes = require('./routes/asanaRoutes');
app.use('/asanas', asanaRoutes)

const quoteRoutes = require('./routes/quotesRoutes');
app.use('/quote', quoteRoutes)

const userRoutes = require('./routes/userRoutes');
app.use('/api/auth', userRoutes);

const commentRoutes = require('./routes/commentRoutes');
app.use('/comment', commentRoutes);

const faqRoutes = require('./routes/faqRoutes');
app.use('/faq', faqRoutes);

const testimonialRoutes = require('./routes/testimonialRoutes');
app.use('/testimonial', testimonialRoutes);

const galleryItemsRoutes = require('./routes/GalleryRoutes');
app.use('/galleryitem', galleryItemsRoutes);

module.exports = app;
