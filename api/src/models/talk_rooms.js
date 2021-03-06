module.exports = function(mongoose) {
    var schema = new mongoose.Schema({
        name:{type:String,default:"talk room"},
        users:[{type:mongoose.Schema.Types.ObjectId,ref:"users"}],
        isOneToOne:Boolean,
        isUsed:{type:Boolean,default:false}, // talks/rooms/from_userでの自動生成でないか、一回でもメッセージがやりとりされていればON
    },{
        timestamps:true
    })
    schema.methods.toResponseObject = async function (token) {
        var obj = this.toObject()
        obj.id = this._id
        obj._id = undefined
        obj.__v = undefined
        if (this.users && this.users.length) {
            for (let i=0;i<this.users.length;i++) {
                if (!this.users[i].toResponseObject) { // collectionでない
                    if (!(typeof obj.users[i] !== "string")) { // IDでもなさそう
                        // その要素をなかったことに
                        obj.users.splice(i,1)
                        this.users.splice(i,1)
                        i--
                        continue
                    }
                    // ユーザーを取得
                    this.users[i] = await mongoose.model("users").findById(obj.users[i])
                }
                obj.users[i] = await this.users[i].toResponseObject(token)
            }
        }
        if (this.isOneToOne) {
            this.users.forEach(function(user) {
                if (user.id != token.user.id) obj.name = user.name+"(@"+user.screenName+")さんとのトーク"
            })
        }
        return obj
    }
    return mongoose.model("talk_rooms",schema)
}
