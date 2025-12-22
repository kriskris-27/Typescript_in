type CallBackFunction = (result:string)=> void

const Performtask=(callback:CallBackFunction)=>{
    setTimeout(()=>{
        const res:string="This is a callback function!"
        console.log("we are inside perform task");
        
        callback(res)
    }
    ,1000)
    console.log("moved out")
}

const sending_to_Perform=(res_string:string)=>{
    console.log(res_string)
}

Performtask(sending_to_Perform)