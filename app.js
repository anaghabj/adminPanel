const express = require('express');
const app = express();
const userRoutes = require('./routes/user')
const adminRoutes = require('./routes/admin');
const path = require('path');
const session = require("express-session")
const nocache = require('nocache')
const connectDB = require('./db/connectDB');
const flash = require('connect-flash');

app.use(nocache())

app.use(session({
  secret: "secretkey",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1 * 60 * 60 * 1000,
    sameSite: "strict",
    httpOnly: true,
  }
}))
//flash
app.use(flash());

//store Flash mesages
app.use((req, res, next) => {
  res.locals.message || null;
  delete req.session.message
  next();
})


app.set("views", path.join(__dirname, 'views'))

app.set('view engine', 'hbs');
app.use(express.static('public'))

//
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

app.get('/', (req, res) => {
  res.redirect('/user/login')
})
app.get('/admin', (req, res) => {
  res.redirect('/admin/login');
})
// app.get('*',(req,res)=>{
//   res.render("error")
// })



//route set
app.use('/user', userRoutes)
app.use('/admin', adminRoutes)

//Error Page
app.use((req, res) => {
  res.status(404);
  res.render('error'); 
});

connectDB();

const PORT = 5000;
const HOST = 'http://localhost'
app.listen(PORT, () => console.log(`server is running at ${HOST}:${PORT}`)
)