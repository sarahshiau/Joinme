import Cookies from "universal-cookie";

export default function authHeader() {
  const cookies = new Cookies(null,{path:"/"})
   

    if ( cookies.get("jwt") ) {
      return { Authorization: 'Bearer ' + cookies.get("jwt") };
    } else {
      return {};
    }
  }