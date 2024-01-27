import User from '../models/user'
import { hashPassword ,comparePassword } from '../helpers/auth';
import jwt from 'jsonwebtoken'
import { nanoid } from 'nanoid'

export const register = async (req,res) =>{
    // console.log(`REGISTER ENDPOINT => ${req.body}`)
    // console.log(res.json({requestBody: req.body}))

    const {name , email, password, secret } = req.body;
    //validation
    if(!name) {
        return res.json({
            error: "Name is required",
        });
    }
    if(!password || password.length<6) {
        return res.json({
            error: "password is required and should be 6 characters long",
        })
    }
    if(!secret){
        return res.json({
            error: "Answer is required",
        })
    } 
    if(!email) {
        return res.json({
            error: "email is required",
        })
    }
    const exist  = await User.findOne({ email })   //findOne will show when he gets one and it is better in terms of performance
    if (exist) {
        return res.json({
            error: "Email is taken",
        })
    }

    //hash password
    const hashedPassword = await hashPassword(password);

    const user = new User({name,email, password: hashedPassword, secret , username: nanoid(6)});
    try{
        await user.save();
        // console.log('REGISTERED USER => ',user);
        return res.json({
            ok: true,
        });
    }
    catch(err){
        console.log('REGISTER FAILED => ',err);
        return res.status(400).send('Error!! Try again...');
    }
}

export const login = async (req,res) => {
    // console.log(req.body);
    try{
        const { email, password } = req.body;
        //check if our db has user with that email
        const user = await User.findOne({ email });
        if (!user){
            return res.json({
                error: "No user found",
            })
        } 
        //check password
        const match = await comparePassword(password,user.password);
        if(!match) {
            return res.json({
                error: "Wrong Password",
            })
        }
        //create signed token
        const token = jwt.sign({_id : user._id}, process.env.JWT_SECRET, {expiresIn : '7d'})//payload id we can access to check in db , secret and expiry of signed token. 
        user.password = undefined
        user.secret = undefined
        res.json({token,user})
    }
    catch(err){
        console.log(err);
        return res.status(400).send ('Error. Try again.')
    }
}

export const currentUser = async(req,res) => {
    // console.log(req.auth);
    try{
        const user = await User.findById(req.auth._id)
        // res.json(user);//not required
        res.json({ok:true});
    }
    catch (err){
        console.log(err);
        res.sendStatus(400);
    }
}


export const forgotPassword = async (req,res) => {
    // console.log(req.body);
    const {email, newPassword, secret} = req.body;
    if(!newPassword || newPassword <6){
        return res.json({
            error: "New password is required and should be min 6 characters long",
        })
    }
    if(!secret){
        return res.json({
            error: "secret is required",
        })
    }
    const user = await User.findOne({email,secret})
    if(!user){
        return res.json({
            error: "We can't verify you with those details",
        })
    }
    try{
        const hashed = await hashPassword(newPassword);
        await User.findByIdAndUpdate(user._id,{password:hashed});
        return res.json({
            success: "Congrats, Now you can login with new password",
        })
    }
    catch(err){
        console.log(err);
        return res.json({
            error: "Something went wrong. Try again."
        })
    }
}

export const profileUpdate = async (req,res) => {
    try{
        // console.log('profileUpdate',  req.body.password)
        // const post = await Post.findByIdAndUpdate(req.params._id)
        const data = {}

        if(req.body.username){
            data.username = req.body.username 
        }
        if(req.body.name){
            data.name= req.body.name 
        }
        if(req.body.about){
            data.about = req.body.about 
        }
        if(req.body.password){
            if(req.body.password.length < 6){
                return res.json ({
                    error: 'Password mut be 6 characters long'
                })
            }
            else{
            data.password = await hashPassword(req.body.password) 
            }
        }
        if(req.body.secret){
            data.secret = req.body.secret 
        }
        if(req.body.image){
            data.image = req.body.image 
        }

        // console.log("id =>", req.auth._id);
        let user = await User.findByIdAndUpdate(req.auth._id,data,{new : true})
        console.log('updated profile user =>', user)

        user.password= undefined;
        user.secret= undefined;
        res.json(user)

    }catch(err){
        if (err.code == 11000){
            return res.json({
                error: "Duplicate userName"
            })
        }
        console.log(err)
    }
}

export const findPeople = async (req,res) => {
    try{
        const user = await User.findById(req.auth._id);
        //user.following
        let following = user.following;
        following.push(user._id);
        const people = await User.find({_id: { $nin: following}}).select('-password -secret').limit(10);
        res.json(people);
    }catch(err){
        console.log(err)
    }
}


//addFollower(middelware)
export const addFollower = async (req,res,next) => {
    try{
        const user = await User.findByIdAndUpdate(req.body._id,{
            $addToSet : {followers: req.auth._id} //to avoid duplicates of the same user id in the followers list of the clicked user ,addToSet is used.
        })
        next()
    }catch(err){
        console.log(err);
    }
}


// userFollow
export const userFollow = async (req,res) => {
    try{
        const user = await User.findByIdAndUpdate(req.auth._id,{
            $addToSet : {following : req.body._id}},
            {new: true}).select('-password -secret')
        res.json(user)
    }catch(err){
        console.log(err)
    }
}

export const userFollowing = async (req,res) => {
    try{
        const user = await User.findById(req.auth._id)
        const following = await User.find({_id : user.following}).limit(100);
        res.json(following)
    }catch(err){
        console.log(err)
    }

}


export const removeFollower = async (req,res,next) => {
    try{
        const user = await User.findByIdAndUpdate(req.body._id, {
           $pull: {followers: req.auth._id} 
        })
        next()
    }catch(err){
        console.log(err)
    }
}

export const userUnfollow = async (req,res) => {
    try{
        const user = await User.findByIdAndUpdate(req.auth._id, {
            $pull: {following : req.body._id}
        },{new: true})
        // console.log('new following array =>',user)
        res.json(user)
    }catch(err){
        console.log(err)
    }
}


export const searchUser = async (req,res) => {
    const {query} = req.params
    if(!query) return 
    //regex is special function of mongodb
    //the i modifier is used for case-insensitive matching   
    try {
        const user = await User.find({
            $or: [
                {name: {$regex : query , $options: 'i'}},
                {username: {$regex : query , $options: 'i'}},
            ],
        }).select('_id name username image followers');
        res.json(user);
    } catch (err) {
        console.log(err)
    }
}

export const getUser = async (req,res) =>{
    // console.log(req.params)
    try {
        const user = await User.findOne({name : req.params.name}).select('-password -secret')
        res.json(user);
    } catch (err) {
        console.log(err)
    }
}