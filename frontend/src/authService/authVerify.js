import moment from "moment";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Cookies from "universal-cookie";

export const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};
export const jwtExp = (token) =>{
  const decodeJwt = parseJwt(token)
  return decodeJwt.exp
}
export const AuthVerify = (props) => {
  let location = useLocation();

  useEffect(() => {
    const cookies = new Cookies(null,{path:"/"})
    const jwt = cookies.get("jwt")
    if (jwt) {
      const decodedJwt = parseJwt(jwt);
      console.log(decodedJwt)
      // 自動登出
      if (decodedJwt.exp * 1000 < Date.now()) {
        props.logOut();
      }
    }
  }, [location, props]);

  return ;
};

