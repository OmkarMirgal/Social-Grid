import express from "express";

const router = express.Router();
//controller
import {register,
    login ,
    currentUser,
    forgotPassword,
    profileUpdate,
    findPeople,
    addFollower,
    userFollow,
    userFollowing,
    removeFollower,
    userUnfollow,
    searchUser,
    getUser,
} from '../controller/auth'

//middleware
import {isAdmin, requireSignin} from '../middlewares/index'


router.post('/register', register)
router.post('/login', login)
router.get('/current-user',requireSignin, currentUser)
router.post('/forgot-password', forgotPassword)

router.put('/profile-update',requireSignin, profileUpdate)
router.get('/find-people',requireSignin,findPeople)

router.put('/user-follow',requireSignin, addFollower, userFollow)
router.get('/user-following',requireSignin, userFollowing)
router.put('/user-unfollow',requireSignin, removeFollower, userUnfollow)

router.get('/search-user/:query',searchUser)

router.get('/user/:name', getUser)

//admin
router.get('/current-admin',requireSignin, isAdmin, currentUser);

module.exports = router;
