const userSchema = require('../model/userModel')
const bcrypt = require('bcrypt');
const saltround = 10;


//register

const registerUser = async (req, res) => {
    try {
        const { email, password } = req.body


        // Validate email
        const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        if (!emailRegex.test(email)) {
            req.flash("error","Email must be a valid @gmail.com")
            return res.redirect('/user/register');
        }

        // Validate password
        if (password.length < 6) {
            req.flash("error","Password must be at least 6 characters.")
            return res.redirect('/user/register');
        }


        const user = await userSchema.findOne({ email })
        if (user) {
            req.flash("error","User already exists")
            return res.redirect('/user/register')
        }
        const hashPassword = await bcrypt.hash(password, saltround)

        const newUser = new userSchema({
            email,
            password: hashPassword
        });

        await newUser.save();
        
        //////
        res.setHeader('Cache-Control', 'no-store');
        req.flash("error","User created successfully")
        return res.redirect('/user/login');

    } catch (err) {
        return res.redirect('/user/register');
    }

}
//login

const login = async (req, res) => {
    try {
        const { email, password } = req.body



        ///
        const user = await userSchema.findOne({ email })
        if (!user) {
            req.flash("error","User not exist");
            return res.redirect('/user/login')
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            req.flash("error","Incorrect password")
            return res.redirect('/user/login')
        }
        req.session.user = { email };
        res.setHeader('Cache-Control', 'no-store');
      //  req.flash("error","User login successfully")
        return res.redirect("/user/home")
    } catch (error) {
        // req.session.message = "something went wrong";

        return res.redirect('/user/login')
    }
}

const loadRegister = (req, res) => {
    const errors = req.flash("error")
    res.render('user/register',{msg:errors})
}
``
const loadLogin = (req, res) => {
    const error = req.flash("error")
   // console.log(error)
    return res.render('user/login',{msg:error})
}

const loadHome = (req, res) => {
    if (!req.session.user) {
        return res.redirect('user/login')
    }
    //split email to get username
    const email = req.session.user.email;
    const username = email.substring(0, email.indexOf('@'));
    res.render('user/userHome',{ username:username})
}

const logout = (req, res) => {
    delete req.session.user;

    res.setHeader('Cache-Control', 'no-store');

    res.redirect('/user/login')
}

module.exports = {
    registerUser,
    loadRegister,
    loadLogin,
    login,
    loadHome,
    logout
}