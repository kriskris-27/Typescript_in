import express, { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { UserService, UserRepo } from "./user.app";
import { catchAsync } from "./catchAsync";

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

const userRepository = new UserRepo();
const userService = new UserService(userRepository)

app.post(
  "/register",
  catchAsync(async (req, res, next): Promise<void> => {
    const { username, email } = req.body;
    const result = await userService.registerUser({
      id: crypto.randomUUID(),
      username,
      email,
    });
    if (!result.success) {
      return next(new AppError(400, result.message));
    }
    res.status(201).json({
      status: "success",
      message: result.message,
      data: { username, email },
    });
  })
);



const ProductValidationSchema = z.object({
  title: z.string().min(2, { message: "title must be at least 2 characters" }),
  price: z.number().gt(0, { message: "price must be greater than 0" }),
  tags: z.array(z.string()),
  status: z.enum(["in_stock", "out_of_stock"]),
});

type Product = z.infer<typeof ProductValidationSchema>;

const product1: Product = {
  title: "apple",
  price: 10,
  tags: ["hi", "hello"],
  status: "in_stock",
};
console.log("Before validation...");

function validateProductData(rawData: unknown) {
  const result = ProductValidationSchema.safeParse(rawData);
  if (result.success) {
    return { success: true as const, data: result.data };
  }
  return { success: false as const, errors: result.error.format() };
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

function globalErrorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ status: "fail", message: err.message });
    return;
  }
  res.status(500).json({ message: "something went wrong" });
}
app.use(globalErrorHandler);

app.listen(3000,()=>{
    console.log("Listening on http://localhost:3000")
})