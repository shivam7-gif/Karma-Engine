export function repairPlannerOutput(
  data : any
){
  if(Array.isArray(data.modules) && typeof data.modules[0] === "string"){
    data.modules = data.modules.map((m : string)=>({
      name : m,
      contains : [],
    }))
  }
  return data;
}