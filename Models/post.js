import mongoose from "mongoose";


const PostSchema = mongoose.Schema({
    title:{
        type:String
    },
    content:{
        type:String
    },
    author:{
        type:String
    }
})

const POST = mongoose.model("Posts",PostSchema)

export default POST;