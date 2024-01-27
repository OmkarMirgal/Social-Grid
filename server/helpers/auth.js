import bcrypt from 'bcrypt'

//12 medium  higher nno. more processing power and slower the hashing  
export const hashPassword = (password)=>{
    return new Promise ((resolve, reject)  => {
        bcrypt.genSalt(12, (err,salt) =>{
            if(err) {
                reject(err);
            }
            bcrypt.hash(password, salt , (err, hash)=>{
                if(err){
                    reject(err);
                }
                resolve(hash);
            })
        }) 
    })
}


export const comparePassword  = (password,hashed) =>{
    return bcrypt.compare(password,hashed)
}