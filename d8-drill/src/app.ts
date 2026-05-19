import express,{Request , Response ,NextFunction} from "express"
import {z} from "zod"

const app = express()

app.use(express.json());

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




const ProductValidationSchema = z.object({
    title:z.string().min(2,{message:"title cant be empty"}),
    price:z.number().gt(0,{message:"only positive values or 0"}),
    tags:z.array(z.string()),
    status:z.enum(["in_stock","out_of_stock"])
})

type product = z.infer<typeof ProductValidationSchema>;

const product1 :product={title:"a",price:10,tags:["hi","hello"],status:"in_stock"}
console.log("Before validation...")

function validateProductData(rawData:any){
    const result= ProductValidationSchema.safeParse(rawData)
    if(result.success){
        return{success:true,
            data:result.data
        }
    }
    else{
        return{
            success:false,
            errors:result.error.format()
        }
    }
}

const result = validateProductData(product1)
console.log(result)

app.post("/products",(req:Request,res:Response,next:NextFunction)=>{
    const data = req.body
    const validate = validateProductData(data)
    if(!validate.success){
        return next(new AppError(400,JSON.stringify(validate.errors)))
    }
    res.status(201).json({status:"success",message:"Product created successfully",data:validate.data})
})

function globalErrorhandler(err:any, req:Request , res:Response ,next:NextFunction):void {
    if(err instanceof AppError){
        res.status(err.statusCode).json({status:"fail",message:err.message})
    }else{
        res.status(500).json({message:"something went wrong"})
    }

}
app.use(globalErrorhandler)

app.listen(3000,()=>{
    console.log("Listening on http://localhost:3000")
})