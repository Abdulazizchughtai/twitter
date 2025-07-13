const User = require('../models/User'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registerUser = async(req, res, next)=>{
    try{
        const{name, email, password} = req.body;
        const exists = await User.findOne({email});
        if(exists)
             return res.status(400).json({message:"user already exists"});

        const hashed = await bcrypt.hash(password,10);
        const user = await User.create({name, email, password: hashed});

        res.status(201).json({
            id:user._id,
            email:user.email,

        })
                
            
       
    }
    catch(err){
        next(err);
    }
}
exports.loginUser = async(req, res, next)=>{
    try{
        const{email, password}=req.body;
        const user = await User.findOne(  {email}); 
        if(!user || !(await bcrypt.compare(password,user.password)))
            return res.status(400).json({message:"Invalid credentials"});
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
            expiresIn: '30d'
        });
        res.status(200).json({token});

    }catch(err){
        next(err);
    }
}


