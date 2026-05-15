
// interface User{
//     readonly id:number,
//     name:string,
//     email?:string,
//     role: "admin" | "user"
// } 


// const newuser:User[] = [{id:2,name:"kris",email:"ex@gmail.com",role:"admin"},{id:3,name:"john",role:"user"}]

// console.log(newuser)


// interface Point{
//     x:number,
//     y:number
// }

// function logP(p:Point){
//     console.log(p.x,p.y)
// }

// const myObj = {x:10,y:40,z:20}

// interface BaseEntity{
//         id:string,
//         createdAt:Date
// }

// interface Product extends BaseEntity {
//     name:string,
//     price:number
// }

// const myprod:Product = {id:"1",createdAt:new Date(),name:"bike",price:500000}



// function processinput(input : string | string[] | null){
//     if(typeof(input) === null)
//         return null
//     else if(Array.isArray(input)) return input[0]
//     else return input
    
// }

// const val = processinput(["1","2"])
// console.log(val)

// interface emailnot{
//     type:"email",
//     recipient:string,
//     body:string
// }

// interface smsnot{
//     type:"sms",
//     phonenum:string,
//     body:string
// }

// type notification = emailnot | smsnot

// function notireader(note:notification){
//     if(note.type=="email")
//         console.log(`sending email to :${note.recipient}`)
//     else console.log(`sending sms to :${note.phonenum}`)
// }

// const inp:emailnot= {type:"email",recipient:"kris@gmail.com",body:"lub u kris"}
// const noti = notireader(inp)


// function genric<T>(input:T):T[]{
//     return [input]
// }

// const num:number[]=genric(5)
// const st:string[]=genric("hello")

// console.log(num,st);


// interface Apiresponse<T>{
//     data:T,
//     status:"success" | "error",
//     timestamp: Date
// }

// interface User{
//     id:number,
//     name:string
// }

// interface Product{
//     id:number,
//     price:number
// }

// const newuser:Apiresponse<User>={data:{id:1,name:"kris"},status:"success",timestamp:new Date}

// const newprod:Apiresponse<Product>={data:{id:1,price:1000},status:"success",timestamp:new Date}

// console.log(newuser.data.name)
// console.log(newprod.data.price)


// function getval<T,K extends keyof T >(obj:T,key:K):T[K]{
//     return obj[key]
// }

// interface User{
//     id:number,
//     name:string,
//     role:"admin"
// }

// const newuser:User={id:101,name:"Kris",role:"admin"}

// console.log(getval(newuser,"name"));
// console.log(getval(newuser,"id"));


// type HasTS = {
//     createdAt:Date,
//     updatedAt:Date
// }

// type UserProfile = {
//     username:string,
//     email:string
// }

// type DbUser = HasTS & UserProfile

// const newUser:DbUser = { createdAt : new Date(),updatedAt: new Date(),username:"Kris",email:"kris@example.com"}

// function printId(id : number | string){
//     if(typeof(id)==="number")
//         return console.log(`ID is a number: ${id*10}`)
//     else
//         return console.log(`ID is a string: ${id.toUpperCase()}`)
// }

// const defaultHeaders = { 
//     "Content-Type": "application/json",
//     Authorization: "Bearer token"
// }

// type Apiheaders = typeof defaultHeaders;

// function sendrequest(reqdata:Apiheaders){
//     console.log(reqdata)    
// }


// interface BigDatabaseResponse {
//     meta: { status: number; requestId: string };
//     payload: {
//         account: {
//             permissions: "read" | "write" | "execute";
//             isActive: boolean;
//         }
//     }
// }
// type AccountAccess = BigDatabaseResponse["payload"]["account"]

// const toaccess:AccountAccess = {permissions : "read",isActive:true}