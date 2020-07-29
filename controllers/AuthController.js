const jwt = require('jsonwebtoken');

const verifyToken = async (req,res,next)=>{
    const bearerHeader = req.headers['authorization'];

    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(' ');
        
        const bearerToken = bearer[1];
        try {
            req.jwt = await jwt.verify(bearerToken,process.env.JWT_SECRET);
            return next();
        } catch (error) {
            console.log(error);
            return res.status(403).json({msg:"Token verification failed"});
        }
        
    }else{
        return res.status(401).json({msg:"Token is not provided"});
    }
}

const adminOnly = (req,res,next)=>{
    const {permission} = req.jwt.user;
    if(permission == 2){
        return next();
    }else{
        return res.status(403).json({msg:"Admin only"});
    }
}

const sameUser = (req,res,next)=>{
    const {id} = req.params;
    if(id === req.jwt.user.id){
        return next();
    }else{
        return res.status(400).json({msg:"Wrong user"});
    }
    
}

const sameUserOrAdmin = (req,res,next)=>{
    const {id} = req.params;
    if(id === req.jwt.user.id || req.jwt.user.permission == 2){
        return next();
    }else{
        return res.sendStatus(400).json({msg:"Wrong user"});
    }
    
}

module.exports = {
    verifyToken,
    adminOnly,
    sameUser,
    sameUserOrAdmin,
}