import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import expressJwt from 'express-jwt';
import User from '../models/user.model';

dotenv.config();



const signUp = async (req, res) => {
    const userExists = await User.findOne({email : req.body.email});
    if(userExists) return res.status(403).json({
        error : "Email is taken"
    })
    const user = await new User(req.body);
    await user.save();
    res.status(200).json({ message : "Sign up successful. Please login" });
};

const signIn = (req, res) => {
    //find the user based on email
    const { email, password } = req.body;
    User.findOne({email}, (err, user) => {
        //if err or no user
        if(err || !user) {
            return res.status(401).json({
                error : "User with that email does not exist. Please sign up"
            })
        }
        //if user is found, make sure the email and password match
        if(!user.authenticate(password)) {
            return res.status(401).json({
                error : "Email and password do not match"
            }) 
        }

        //if user is found, authenticate

        //generate a token with user id and secret
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);
        //persist the token as 'tk' in cookie with expiry date
        res.cookie('tk', token, {expire: new Date() + 9999})
        //return response with user and token to frontend client
        const { _id, name, email } = user;
        return res.json({token, user : {_id, email, name}});
    })
    
}

const signOut = (req, res) => {
    res.clearCookie('tk')
    return res.json({message : "Signout success"});
}

const requireSignIn = expressJwt({
    //if token is valid, express jwt appends the verified users id in an auth key to the request object
    secret : process.env.JWT_SECRET,
    userProperty : "auth"
});

export { signUp, signIn, signOut, requireSignIn };