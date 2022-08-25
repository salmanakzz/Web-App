let db = require('../config/connection')
let collection = require('../config/collections')
const bcrypt = require('bcrypt')
const { response } = require('../app')
let objectId = require('mongodb').ObjectID

module.exports = {
    doSignup:(userData) => {
        return new Promise(async(resolve,reject) =>{
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({Email:userData.Email})
            if(user){
                response.emailExists=true
                resolve(response)
            }else{
                response.emailExists=false
                userData.Password = await bcrypt.hash(userData.Password,10)
                db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) =>{
                    resolve(data.insertedId,response)
                })
            }
           
        })
        
    },
    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus = false
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({Email:userData.Email})
            if (user) {
                bcrypt.compare(userData.Password,user.Password).then((status)=>{
                    if (status) {
                        console.log('login success');
                        response.user = user
                        response.status = true
                        resolve(response)
                    }else{
                        console.log('login failed');
                        resolve({status:false})
                    }
                })
            }else{
                console.log('login failed');
                resolve({status:false})
            }
        })
    },
    getAllUsers:()=>{
        return new Promise(async(resolve,reject)=>{
            
            let users = await db.get().collection(collection.USER_COLLECTION).find().toArray()
            resolve(users)
        })
    },
    deleteUser:(userID)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).deleteOne({_id:objectId(userID)}).then((response)=>{
                resolve(response)
            })
        })
    },
    getOneUser:(userID)=>{
        return new Promise((resolve,reject)=>{
            
            db.get().collection(collection.USER_COLLECTION).findOne({_id:objectId(userID)}).then((user)=>{
                resolve(user)
            })
            
        })
    },
    updateUser:(userID,userDetails)=>{
       
        return new Promise(async(resolve,reject)=>{
            let userExist = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({Email:userDetails.Email})
            console.log(user);
            console.log(userDetails);
            if (user) {
                userExist.user  = true
                resolve(userExist)
            }
            else{
                userDetails.Password = await bcrypt.hash(userDetails.Password,10)
            db.get().collection(collection.USER_COLLECTION)
            .updateOne({_id:objectId(userID)},{
                $set:{
                    Name:userDetails.Name,
                    Email:userDetails.Email,
                    Password:userDetails.Password
                }
            }).then((response)=>{
                resolve(userExist)
            })
            }
        })
    },
    adminLogin:(adminData)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus = false
            let response = {}
            let admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({Email:adminData.Email})
           
            if (admin) {
                if(adminData.Password == admin.Password){
                  
                        console.log('login success');
                        response.admin = admin
                        response.status = true
                        resolve(response)
                    }else{
                        console.log('login failed');
                        resolve({status:false})
                    }
                }else{
                    console.log('login failed');
                    resolve({status:false})
                }
            
        })
    },
    getFindUsers:(searchData)=>{
        return new Promise(async(resolve,reject)=>{
            
            let usersFind = await db.get().collection(collection.USER_COLLECTION).find({Name:searchData.Name}).toArray()
            resolve(usersFind)
        })
    },
    addUser:(userData) => {
        return new Promise(async(resolve,reject) =>{
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({Email:userData.Email})
            if(user){
                response.emailExists=true
                resolve(response)
            }else{
                response.emailExists=false
                userData.Password = await bcrypt.hash(userData.Password,10)
                db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) =>{
                    resolve(data.insertedId,response)
                })
            }
           
        })
        
    }
}