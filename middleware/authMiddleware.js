import User from '../models/userModel.js'
import jwt from 'jsonwebtoken'

export const protect = async(req,res,next) =>{
    try {
        const authHeader = req.headers.authorization 
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(401).json({
                message : "Not authorized , no token"
            })
        }
        const token = authHeader.split(' ')[1]
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        req.user = await User.findById(decoded.id).select('-password')
        if(!req.user){
            return res.status(401).json({
                message : 'User not found'
            })
        }
        next()
    } catch (error) {
        console.error(error);
        res.status(401).json({
            message : 'Token Invalid or expired'
        })
    }
};

export default protect