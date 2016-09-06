var rndstr = require("rndstr");
module.exports = function(mongoose) {
  function generateAccessToken() {
      return rndstr()+"-"+rndstr();
  }
  var schema = new mongoose.Schema({
    name:String,
    app:{type:mongoose.Schema.Types.ObjectId,ref:"apps"},
    user:{type:mongoose.Schema.Types.ObjectId,ref:"users"},
    token:{type:String,default:generateAccessToken},
  },{
    timestamps:true
  })
  schema.methods.toResponseObject = function(){
    var obj = this.toObject();
    obj._id = undefined;
    obj.__v = undefined;
    obj.app = undefined;
    obj.user = undefined;
    return obj;
  }
  return mongoose.model("access_tokens",schema)
};