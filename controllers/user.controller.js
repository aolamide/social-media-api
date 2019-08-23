import User from '../models/user.model';
import _ from 'lodash';

const userById = (req, res, next, id) => {
    User.findById(id)
    .exec((err, user) => {
        if(err || !user){
            return res.status(400).json({
                error: "User not found"
            })
        }
        req.profile = user; // adds profile object in req with user info
        next();
    })
}

const hasAuthorization = (req, res, next) => {
    const authorized = req.profile && req.auth && req.profile._id === req.auth._id;
    if(!authorized) {
        res.status(403).json({
            error : "User is not authorized to perform this action"
        })
    }
}

const allUsers = (req, res) => {
    User.find((err, users) => {
        if(err || !users) {
            return res.status(400).json({
                error : err
            });
        }
        res.json({users});
    })
    .select("name email updated created");
} 

const getUser = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
};

const updateUser = (req, res, next) => {
    let user = req.profile;
    user = _.extend(user, req.body); //mutate source object
    user.updated = Date.now()
    user.save((err) => {
        if(err) {
            return res.status(400).json({
                error: "You are not authorized to perform this action"
            })
        }
        user.hashed_password = undefined;
        user.salt = undefined;
        res.json({user})
    })
}

const deleteUser = (req, res) => {
    let user = req.profile;
    user.remove((err, deletedUser) => {
        if(err) {
            return res.status(400).json({
                error : err
            })
        }
        res.json({
            message : "Profile successfully deleted"
        })
    })
}


export { userById, hasAuthorization, allUsers, getUser, updateUser, deleteUser };   