import express,{Request , Response} from "express"

const app = express()

app.get("/health" , (req:Request,res:Response):void=>{
    res.status(200).json({message:"health looks good"})
})