export const fetchPost = (endpoint,body, headers = {Accept: "application/json","Content-Type": "application/json"}) => {
    return fetch(endpoint,{
        method: "POST",
        headers,
        body:JSON.stringify(body)
      }).then( res => {
        return res.json()
      }).then((res)=>{
        return res
      })
      .catch(err => {
        console.log("Fetch error is: ", err.message);
      })
    
    }
  
    export const fetchGet =   (endpoint, params = null , headers = {Accept: "application/json","Content-Type": "application/json"}) => {
    
      if (params !== null) {
        const urlParams =  '?' + new URLSearchParams(Object.entries(params));
        endpoint = endpoint + urlParams
      }
     return  fetch(endpoint,{
        method: "GET",
        headers,
      }).then( res => {
        return res.json()
      }).then((res)=>{
        return res
      })
      .catch(err => {
        console.log("Fetch error is: ", err.message);
        return err.message
      })
    
    }
  