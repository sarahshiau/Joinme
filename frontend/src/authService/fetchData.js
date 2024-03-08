import axios from "axios";
import authHeader from "./authHeader";
const url = "http://localhost:8080/"
const getData = async (api,params)=>{
    return await axios.get(
        url+api ,{
            headers: authHeader(),
            params:{
                ...(params && {...params})
            }
        }
    )
    .then((res)=>{
        return res.data
    })
    .catch((error)=>{
        alert(error.response.data)
        window.location.href = "/"
        return undefined
    })
}

const postData = async (api, body) => {
    return await axios.post(
        url+api, body, {headers: authHeader()}
    )
    .then((res) => {
        return res.data;
      })
    .catch((error) => {
        console.log(error);
        alert(error.response.data);
        window.location.href = "/";
        return undefined;
      });
}

const putData = async (api, body) => {
    return await axios.put(
        url+api, body, {headers: authHeader()}
    )
    .then((res) => {
        return res.status;
      })
    .catch((error) => {
        console.log(error);
        alert(error.response.data);
        window.location.href = "/";
        return undefined;
      });
}

const FetchData = {
    getData,
    postData,
    putData
}

export default FetchData