
interface User{
    readonly id:number,
    name:string,
    email?:string,
    role: "admin" | "user"
} 

const newuser:User[] = [{id:2,name:"kris",email:"ex@gmail.com",role:"admin"},{id:3,name:"john",role:"user"}]

console.log(newuser)


interface Point{
    x:number,
    y:number
}

function logP(p:Point){
    console.log(p.x,p.y)
}

const myObj = {x:10,y:40,z:20}

interface BaseEntity{
        id:string,
        createdAt:Date
}

interface Product extends BaseEntity {
    name:string,
    price:number
}

const myprod:Product = {id:"1",createdAt:new Date(),name:"bike",price:500000}
