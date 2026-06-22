
const cleanPayload=(payload)=>{
    const cleanObj={
    }
    const payloadArr=Object.keys(payload)
    payloadArr.forEach((v)=>{
        if(payload[v] !==undefined && payload[v] !==null){
            cleanObj[v]=payload[v]
        }})
        return cleanObj
}
module.exports={cleanPayload}