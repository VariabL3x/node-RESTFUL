const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const register = (req,res) =>{
    const {firstname,lastname,email,password} = req.body;
    const hashPassword = bcrypt.hashSync(password,10);
    
    const user = new User({
        firstname,
        lastname,
        email,
        password:hashPassword
    });

    user.save()
        .then(()=>{
            return res.status(201).json({msg:"User Successfully registered"})
        })
        .catch((err)=>{
            return res.json({err});
        })
}

const login = async (req,res)=>{
    const {email,password} = req.body;
    User.findOne({email})
    .then((result)=>{
        if(result!==null){
            if(bcrypt.compareSync(password,result.password)){
                const user = {id:result._id,email:result.email,permission:result.permissionLevel};
                const token = jwt.sign({
                    exp:Math.floor(Date.now()/1000) + (60*60),
                    user,
                },process.env.JWT_SECRET);
                return res.json({token,id:result._id});
            }else{
                return res.json({err:"Incorrect Password"})
            }
        }else{
            return res.json({err:"User Not Found"})
        }
    })
    .catch((err)=>{
        return res.json({err});
    })
}

const get_all = (req,res)=>{
    User.find().sort({createdAt:-1})
    .then((users)=>{
        return res.json({users,data:req.jwt});
    })
    .catch((err)=>{
        return res.json(err)
    })
}

const get_by_id = (req,res)=>{
    const {id} = req.params;
    User.findById(id)
    .then((result)=>{
        return res.json(result);
    })
    .catch((err)=>{
        return res.status(400).json('Error: '+ err);
    })
}

const put_by_id = (req,res)=>{
    const{firstname,lastname} = req.body;
    const {id} = req.jwt.user;
    User.findOneAndUpdate(id,{firstname,lastname})
    .then(()=>{
        res.sendStatus(204);
    })
    .catch((err)=>{
        res.send(400).json('Error ' + err);
    })
}

const update_password = (req,res)=>{
    const {old_password,new_password} = req.body;
    const {email} = req.jwt.user;
    console.log(email,old_password,new_password);
    const hash = bcrypt.hashSync(new_password,10);
    User.comparePassword(email,old_password).then((result)=>{
        if(result){
            User.findOneAndUpdate(email,{password:hash}).then((result)=>{
                console.log(result);
                res.sendStatus(204);
            }).catch((err)=>{
                res.send(500).json({err});
            })
        }else{
            res.status(400).json({msg:"Incorrect Password"});
        }
    })
}
module.exports = {
    register,
    login,
    get_all,
    get_by_id,
    put_by_id,
    update_password,
}