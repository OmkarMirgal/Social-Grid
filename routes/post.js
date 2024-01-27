import express from "express";
import formidable from 'express-formidable'

const router = express.Router();
//controller
import {createPost, uploadImage, postsByUser, userPost, updatePost,deletePost,timeLine,likePost,unlikePost,addComment,removeComment,totalPost,posts,getpost} from '../controller/post'

//middleware
import {requireSignin, canEditDeletePost, isAdmin} from '../middlewares/index'


router.post('/create-post', requireSignin, createPost)
router.post('/upload-image', requireSignin,formidable({maxFileSize : 5 * 1024 * 1024}), uploadImage);

//posts
router.get('/user-posts',requireSignin,postsByUser);//not used 
router.get('/user-post/:_id',requireSignin, userPost);
router.put('/update-post/:_id', requireSignin, canEditDeletePost, updatePost);
router.delete('/delete-post/:_id', requireSignin, canEditDeletePost, deletePost);

router.get('/timeline/:page',requireSignin,timeLine)
router.put('/like-post',requireSignin,likePost)
router.put('/unlike-post',requireSignin,unlikePost)
router.put('/add-comment',requireSignin,addComment)
router.put('/remove-comment',requireSignin,removeComment)

router.get('/total-posts',totalPost)
router.get('/posts',posts)
router.get('/getpost/:_id',getpost)

//admin
router.delete('/admin/delete-post/:_id', requireSignin, isAdmin, deletePost);




module.exports = router;
