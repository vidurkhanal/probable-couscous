import mongoose,{Schema,Document} from 'mongoose'

export interface ITextSchema extends Document {
    channelName:string,
    conversation?:[
        {
            message:string,
            timeStamp:string,
            user:{
               displayName:string,
               email:string,
               photo:string,
               uid:string, 
            },
        }
    ]
}

const textSchema:Schema = new Schema({
    channelName:String,
    conversation:[
        {
            message:String,
            timeStamp:String,
            user:{
               displayName:String,
               email:String,
               photo:String,
               uid:String, 
            },
        }
    ]
})

export default mongoose.model<ITextSchema>('Texts',textSchema)