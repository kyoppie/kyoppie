var getHashedPassword = require("../utils/getHashedPassword")
var newPasswordHash = require("../utils/newPasswordHash")
var isAprilFool = require("../utils/isAprilFool")
module.exports = function(mongoose) {
    var schema = new mongoose.Schema({
        name:{type:String,default:"no name"},
        screenName:{type:String,required:true},
        screenNameLower:{type:String,required:true},
        password:{type:String,required:true},
        passwordSalt:{type:String,required:true},
        postsCount:{type:Number,default:0},
        followersCount:{type:Number,default:0},
        followingCount:{type:Number,default:0},
        adminLevel:{type:Number,default:0},
        isVerified:{type:Boolean,default:false},
        push:{
            chrome:[String],
            firefox:[String],
            pushbullet:[String]
        },
        adminFlag:{
            fileServer:Boolean,
            userMng:Boolean,
            siteConfig:Boolean,
        },
        isSuspended:{type:Boolean,default:false},
        avatar:{type:mongoose.Schema.Types.ObjectId,ref:"files"},
        avatarUrl:{type:String,default:"https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mm&f=y"},
        avatarThumbnailUrl:{type:String,default:"https://www.gravatar.com/avatar/00000000000000000000000000000000.jpg?d=mm&f=y"},
        rulesAgree:{type:Boolean,defualt:false},
    },{
        timestamps:true
    })
    schema.methods.setPassword = function(password) {
        var salt = newPasswordHash(this.screenName)
        var hashPassword = getHashedPassword(password,salt)
        this.password = hashPassword
        this.passwordSalt = salt
    }
    schema.methods.isValidPassword = function(password) {
        var salt = this.passwordSalt
        var hashPassword = getHashedPassword(password,salt)
        return this.password === hashPassword
    }
    schema.methods.toResponseObject = async function (token) {
        var obj = this.toObject()
        obj.id = this._id
        obj._id = undefined
        obj.__v = undefined
        obj.password = undefined
        obj.passwordSalt = undefined
        obj.push = undefined
        if (obj.avatar && obj.avatar.toResponseObject) {
            obj.avatar = await this.avatar.toResponseObject(token)
        }
        if (token) {
            obj.isFollowing = !!(await mongoose.model("follows").findOne({fromUser:token.user.id,toUser:obj.id}))
            obj.isFollowers = !!(await mongoose.model("follows").findOne({toUser:token.user.id,fromUser:obj.id}))
        }
        if (isAprilFool(2017)) {
            obj.postsCount = 5000000000000000
            obj.followersCount = 5000000000000000
            obj.followingCount = 5000000000000000
        }
        return obj
    }
    return mongoose.model("users",schema)
}
