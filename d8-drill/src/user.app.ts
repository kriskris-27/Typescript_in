export interface UserPro{
    id:string;
    username:string;
    email:string
}

export interface IUserRepository{
    save(user:UserPro):void;
    findByEmail(email:string):UserPro | undefined;
}


export class UserRepo implements IUserRepository {
    private users:UserPro[] = [];
    save(user:UserPro){
        this.users.push(user)
    }
    findByEmail(email: string): UserPro | undefined {
        return this.users.find(user =>user.email === email)
    }
}

export class UserService {
    constructor(private userRepo:IUserRepository){}

    registerUser(newUser:UserPro):{success:boolean;message:string}{
        if(this.userRepo.findByEmail(newUser.email)==undefined){
            this.userRepo.save(newUser)
            return {success:true,message:"User successfully added"}
        }
        else{
            return {success:false,message:"User already registered"}
        }
    }
}