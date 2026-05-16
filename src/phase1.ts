type BaseEntity ={
    id:string,
    createdAt:Date
}

type DatabaseAction = {type:"clear_all"} | {type : "delete_by_id" ; targetId:string}

class DataStore<T extends BaseEntity>{
    private items: T[]= []
    save(item:T):void {
        this.items.push(item)
    }

    findById(id:string) : T | undefined {
        return this.items.find((item)=>item.id===id)
    }

    getPropertyrecord<K extends keyof T>(id:string,key:K): T[K]|undefined {
        const itemm = this.findById(id) 
        return itemm?.[key]
    }

    executeAction(action:DatabaseAction){
        if(action.type=="clear_all"){
            this.items = []
        }
        else if(action.type=="delete_by_id"){
            this.items =  this.items.filter(item => item.id!==action.targetId)
        }
    }
}

interface UserProfile {
    id: string;
    createdAt: Date;
    username: string;
    role: "admin" | "user";
}

// Instantiate your DataStore specifically for UserProfiles
const userStore = new DataStore<UserProfile>();

