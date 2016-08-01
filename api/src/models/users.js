module.exports = function(mongoose) {
  var schema = new mongoose.Schema({
    name:String,
    screenName:String,
    screenNameLower:String,
    password:String,
    passwordSalt:String,
    postsCount:Number,
    followersCount:Number,
    followingCount:Number,
    adminLevel:{type:Number,default:0},
    isVerified:Boolean,
    push:{
        chrome:[String],
        firefox:[String]
    }
  },{
    timestamps:true
  })
  schema.methods.toResponseObject = function(){
    var obj = this.toObject();
    obj.id = this._id;
    obj._id = undefined;
    obj.__v = undefined;
    obj.password = undefined;
    obj.passwordSalt = undefined;
    obj.push = undefined;
    console.log(obj,this)
    return obj;
  }
  return mongoose.model("users",schema)
};
