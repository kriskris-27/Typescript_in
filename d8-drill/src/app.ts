import { NextFunction } from './../node_modules/@types/express-serve-static-core/index.d';
import express,{Request , Response} from "express"
import {infer, z} from "zod"

const app = express()

app.get("/health" , (req:Request,res:Response):void=>{
    res.status(200).json({message:"health looks good hi"})
})

class AppError extends Error{
    public readonly statusCode:number;
    constructor(statusCode:number, message:string) {
        super(message)
        this.statusCode=statusCode
        Object.setPrototypeOf(this,new.target.prototype);
    }

}

function globalErrorhandler(err:any, req:Request , res:Response ,next:NextFunction):void {
    if(err instanceof AppError){
        res.status(err.statusCode).json({status:"fail",message:err.message})
    }else{
        res.status(500).json({message:"something went wrong"})
    }

}


const ProductValidationSchema = z.object({
    title:z.string().min(2,{message:"title cant be empty"}),
    price:z.number().gt(0,{message:"only positive values or 0"}),
    tags:z.array(z.string()),
    status:z.enum(["in_stock","out_of_stock"])
})

type product = z.infer<typeof ProductValidationSchema>;

const product1 :product={title:"a",price:10,tags:["hi","hello"],status:"in_stock"}
console.log(product1)

app.listen(3000,()=>{
    console.log("Listening on http://localhost:3000")
})