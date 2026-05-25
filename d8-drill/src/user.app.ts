export interface UserPro{
    id:string;
    username:string;
    email:string
}

export interface IUserRepository{
    save(user:UserPro):Promise<void>;
    findByEmail(email:string):Promise<UserPro | undefined>;
}  


export class UserRepo implements IUserRepository {
    private users:UserPro[] = [];
    async save(user:UserPro){
        this.users.push(user)
    }
    async findByEmail(email: string) {
        return this.users.find(user =>user.email === email)
    }
}

export class UserService {
    constructor(private userRepo:IUserRepository){}

    async registerUser(newUser:UserPro):Promise<{success:boolean;message:string}>{
        if(await this.userRepo.findByEmail(newUser.email)==undefined){
            await this.userRepo.save(newUser)
            return {success:true,message:"User successfully added"}
        }
        else{
            return {success:false,message:"User already registered"}
        }
    }
}