const adminModel = require('../model/adminModel');
const bcrypt = require('bcrypt');
const userModel = require('../model/userModel');
const saltround=10;


const loadLogin = async (req, res) => {
    const error = req.flash('error')
    res.render('admin/login',{message:error});
};





const createAdmin = async () => {
    try {
        const saltRounds = 10;
        const plainPassword = "admin@123";  // Password to be hashed
        const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

        const newAdmin = new adminModel({
            username: "admin",  // Admin username
            password: hashedPassword  // Store the hashed password
        });

        await newAdmin.save(); // Save the new admin to the database
        console.log("Admin created successfully!");
    } catch (err) {
        console.error("Error creating admin:", err);
    }
};

createAdmin();








const login = async (req, res) => {
    
    try {
        const { username, password } = req.body;
        

        const admin = await adminModel.findOne({ username });
        if (!admin) {
            req.flash("error","Incorrect username or password")
            return res.redirect('/admin/login');
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            req.flash("error","Incorrect username or password")
            return res.redirect('/admin/login');
        }


        req.session.admin = { id: admin._id, username: admin.username };
      

        res.redirect('/admin/dashboard');
        
    } catch (err) {
        console.error("Login Error:", err);
        req.flash("error","Something went wrong, please try again!")
        return res.redirect('/admin/login');
    }
};


const loadDashboard = async (req, res) => {
    try {
        const admin = req.session.admin;
        if (!admin) return res.redirect('/admin/login');
        

        const users = await userModel.find({});
        res.render('admin/dashboard', {username:admin.username, users });
    } catch (error) {
        console.error("Dashboard Error:", error);
        res.redirect('/admin/login');
    }
};
 
//search
const searchUsers =  async (req,res)=>{

    if(req.session.admin){
        const searchData  = req.body
        // console.log(searchData)
        const searchUser = await userModel.find({email:{$regex:searchData.search,$options:'i'}})
        res.render('admin/dashboard',{users:searchUser})
    }else{
        return res.redirect('/admin/dashboard');
    }
  
}

const editUser = async (req,res)=>{
    try{
       const {email, password,id} = req.body
       const hashPassword = await bcrypt.hash(password,saltround)
       const users = await userModel.findOneAndUpdate({_id:id},{$set:{email,password:hashPassword}})
    //  console.log(users);
       

      req.flash('success', 'User updated successfully');
      res.redirect('/admin/dashboard');


      
    }catch(error){
        console.log(error);
        
    }
}

const deleteUser = async (req,res) => {
    try{
        const {id} = req.params;
        const user = await userModel.findOneAndDelete({_id:id})
        res.redirect('/admin/dashboard')
      }catch(err){
        console.log(err);
        
      }
}

const addUser = async (req,res) =>{
    try{
     const {email, password} = req.body;
     const hashPassword = await bcrypt.hash(password,10)

     const newUser = new userModel({
        email,
        password:hashPassword
     })
     await newUser.save()
     res.redirect('/admin/dashboard')
    }catch(error){
  console.log(error);
  
    }
}

const logout=(req,res)=>{
    req.session.admin=null

    res.setHeader('Cache-Control', 'no-store');

    res.render('admin/login')
}




module.exports = { loadLogin, login, loadDashboard ,searchUsers, editUser,deleteUser,addUser,logout };
 