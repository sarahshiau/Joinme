import React, { Component, useContext, useEffect, useState, useRef } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import Card from '@mui/material/Card';
import { useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import axios from "axios";
import AuthService from "./authService";
import Container from '@mui/material/Container';

const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

export default function Login() {
  
    const [userName, setUserName] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    const form = useRef();
    const checkBtn = useRef();
    

    function handleLogin(e) {
        e.preventDefault();
        setMessage("")
        setLoading(true)
        form.current.validateAll();
      if (checkBtn.current.context._errors.length === 0) {

            AuthService.login(userName, password)
            .then((res)=> {
              console.log(res)
                // this.props.history.push("/profile");
                  window.location.href='/'
            },
            error => {
                const resMessage =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
                setLoading(false)
                setMessage(resMessage)
            }
            );
      } else {
        setLoading(false)
      }
    }

      return (
      
        <Box sx={{height:"100%"}} >
            <Paper sx={{
                height: "200hv",
                display: "flex",
                textAlign:'center',
                justifyContent:'center',}} 
                elevation={8}
           >
          <div className="col-md-4">
            <Card variant="outlined" sx={{flexDirection:'column',display:'flex',alignItems:'center'}}>
                <Typography variant="h3" gutterBottom justifyContent='center' display='flex'>
                    I'm in
                </Typography>
                <Form
                    onSubmit={handleLogin}
                    ref={form}
                >
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="username"
                    value={userName}
                    onChange={(e)=>setUserName(e.target.value)}
                    validations={[required]}
                 
                  />
                </div>
  
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <Input
                    type="password"
                    className="form-control"
                    name="password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    validations={[required]}
                  />
                </div>
  
                <div className="form-group">
                  <button
                    className="btn btn-primary btn-block"
                    disabled={loading}
                    onClick={()=>handleLogin}
                  >
                    {loading && (
                      <span className="spinner-border spinner-border-sm"></span>
                    )}
                    <span>Login</span>
                  </button>
                </div>
  
                {message && (
                  <div className="form-group">
                    <div className="alert alert-danger" role="alert">
                      {message}
                    </div>
                  </div>
                )}
                <CheckButton
                  style={{ display: "none" }}
                  ref={checkBtn}
                />
              </Form>
            </Card>
          </div>
          {/* </Box> */}
            </Paper>
        </Box>
      );
    
  }
  