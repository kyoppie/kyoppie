module.exports = function(mongoose) {
    var schema = new mongoose.Schema({
        room:{type:mongoose.Schema.Types.ObjectId,ref:"talk_rooms"},
        user:{type:mongoose.Schema.Types.ObjectId,ref:"users"},
        text:String,
        files:[{type:mongoose.Schema.Types.ObjectId,ref:"files"}],
        app:{type:mongoose.Schema.Types.ObjectId,ref:"apps"},
    },{
        timestamps:true
    })
    schema.methods.toResponseObject = async function (token) {
        var obj = this.toObject()
        obj.id = this._id
        delete obj._id
        delete obj.__v
        if (this.user.toResponseObject) obj.user=await this.user.toResponseObject(token)
        else {
            this.user = await mongoose.model("users").findById(this.user)
            if (this.user) obj.user = await this.user.toResponseObject(token)
        }
        if (this.app && this.app.toResponseObject) {
            obj.app=await this.app.toResponseObject(token)
            delete obj.app.appKey
            delete obj.app.appSecret
        }
        if (this.files && this.files.length) {
            for (let i=0;i<this.files.length;i++) {
                if (!this.files[i].toResponseObject) {
                    obj.files = []
                    break
                }
                obj.files[i] = await this.files[i].toResponseObject(token)
            }
        }
        return obj
    }
    return mongoose.model("talk_messages",schema)
}
