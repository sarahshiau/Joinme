import React, { Component, useState, useEffect} from "react";
import { Routes, Route, Link, Router, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./authService/authService";
import Login from "./authService/login";
import Register from "./authService/register";
import { styled, useTheme } from '@mui/material/styles';
import SearchPage from "searchPage";
import CreateEvent from "createEventService/createEvent";
import MyEvents from "event/myEvent";
import MyParticipation from "event/myParticipation";
import BookedClassroom from "createEventService/bookedClassroom";
import eventBus from './authService/eventBus';
import {AuthVerify} from './authService/authVerify';
import { AppBar, Box, Button, Paper} from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Drawer from '@mui/material/Drawer';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LoginIcon from '@mui/icons-material/Login';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useCallback } from "react";
import Courses from "course/courses";
import CreateCourse from "course/createCourse";
import EditCourse from "course/editCourse";
import Classrooms from "classroom/classrooms";
import CreateClassroom from "classroom/createClassroom";
import EditClassroom from "classroom/editClassroom";
import Users from "admin/user/users";
import UserEvent from "admin/user/UserEvent";
import UserParticipation from "admin/user/UserParticipation";
import Dashboard from "classroom/dashboard";


const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));



export default class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);
    this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
    this.handleDrawerClose = this.handleDrawerClose.bind(this);

    this.state = {
      verified: false,
      user: false,
      provider: false,
      open:false
    };
  }

  componentDidMount() {
    const roles = AuthService.getCurrentRoles();
    console.log(roles)
    if (roles) {
      this.setState({
        verified: true,
        user: roles.includes("ROLE_USER"),
        provider: roles.includes("ROLE_PROVIDER"),
      });
    }
    
    eventBus.on("logout", () => {
      this.logOut();
    });
  }

  componentWillUnmount() {
    eventBus.remove("logout");
  }
  handleDrawerClose(e) {
    this.setState({
      open:false
    });
  }
  handleDrawerOpen(e){
    this.setState({
      open:true
    });
  }
  logOut() {
    AuthService.logout();
    this.setState({
      verified: undefined,
      user: false,
      provider: false,
    });
    window.location.href="/login"
  }

  render() {
    // let isTabHidden = false;
    // function clearUser(){
    //   localStorage.removeItem("user");
    // }
   
    // document.addEventListener('visibilitychange', () => {
    //   if (document.visibilityState === 'hidden') {
    //       isTabHidden = true;
    //   }
    //  });
    // window.addEventListener('beforeunload',()=>{
    //   if(isTabHidden){
    //     localStorage.removeItem("user")} });
    const { verified, user, provider, open } = this.state;
    return (
    
      <>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={this.handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" >
            I'm in
          </Typography>
          {verified?
          // <Box display='flex' justifyContent='right'>
            <Button  display='flex' variant="h6" onClick={this.logOut} sx={{ marginLeft: "auto" }}>
              Logout
            </Button>:""
          // </Box>
        }
        </Toolbar>
      </AppBar>
      <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <DrawerHeader>
            <IconButton onClick={this.handleDrawerClose}>
              {<ChevronLeftIcon /> }
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
              {verified?"":(
                <>
              <ListItem  disablePadding >
                <ListItemButton to='/register'>
                  <ListItemIcon>
                    
                  </ListItemIcon>
                  <ListItemText primary={"Register"} />
                </ListItemButton>
              </ListItem>
              <ListItem  disablePadding >
                <ListItemButton to='/login'>
                  <ListItemIcon>
                    {<LoginIcon></LoginIcon>}
                  </ListItemIcon>
                  <ListItemText primary={"Login"} />
                </ListItemButton>
              </ListItem>
              </>
              )}
              {user?(
                <>
              <ListItem  disablePadding >
                <ListItemButton to='/home'>
                  <ListItemIcon>
                    
                  </ListItemIcon>
                  <ListItemText primary={"Home"} />
                </ListItemButton>
              </ListItem>
              <ListItem  disablePadding >
                <ListItemButton to="/events">
                  <ListItemIcon>
                
                  </ListItemIcon>
                  <ListItemText primary={"活動"} />
                </ListItemButton>
              </ListItem>
              <ListItem  disablePadding >
                <ListItemButton to="/chooseClassroom">
                  <ListItemIcon>
                
                  </ListItemIcon>
                  <ListItemText primary={"創建活動"} />
                </ListItemButton>
              </ListItem>
              <ListItem  disablePadding >
                <ListItemButton to="/myEvents">
                  <ListItemIcon>
                
                  </ListItemIcon>
                  <ListItemText primary={"我舉辦的活動"} />
                </ListItemButton>
              </ListItem>
              <ListItem  disablePadding >
                <ListItemButton to="/myParticipation">
                  <ListItemIcon>
                
                  </ListItemIcon>
                  <ListItemText primary={"我參加的活動"} />
                </ListItemButton>
              </ListItem>
              </>
              ):""}
              {provider?(
                <>
              <ListItem  disablePadding >
                <ListItemButton to="/events">
                  <ListItemIcon>
                
                  </ListItemIcon>
                  <ListItemText primary={"活動查詢"} />
                </ListItemButton>
              </ListItem>
              <ListItem  disablePadding >
                <ListItemButton to="/admin/users">
                  <ListItemIcon>
                
                  </ListItemIcon>
                  <ListItemText primary={"用戶查詢"} />
                </ListItemButton>
              </ListItem>
              <ListItem  disablePadding >
                <ListItemButton to="/classrooms">
                  <ListItemIcon>
                
                  </ListItemIcon>
                  <ListItemText primary={"教室管理"} />
                </ListItemButton>
              </ListItem>
              <ListItem  disablePadding >
                <ListItemButton to="/courses">
                  <ListItemIcon>
                
                  </ListItemIcon>
                  <ListItemText primary={"課程管理"} />
                </ListItemButton>
              </ListItem>
                </>
              ):""
              }
              
          </List>
          <Divider />
      </Drawer>
      <DrawerHeader />
      <Container>
            {/* <Box  display="flex"
                justifyContent="center"
                alignItems="center"> */}
              <Routes>
                  <Route exact path="/login" element={<Login /> } />
                  <Route exact path="/register" element={<Register />} />
                  <Route exact path="/events" element={<SearchPage />} />
                  <Route exact path="/createEvents" element={<CreateEvent />} />
                  <Route exact path="/myEvents" element={<MyEvents />} />
                  <Route exact path="/myParticipation" element={<MyParticipation />} />
                  <Route exact path="/chooseClassroom" element = {<BookedClassroom />} />
                  <Route exact path="/courses" element = {<Courses />} />
                  <Route exact path="/createCourse" element = {<CreateCourse />} />
                  <Route exact path="/editCourse" element = {<EditCourse />} />
                  <Route exact path="/classrooms" element = {<Classrooms />} />
                  <Route exact path="/createClassroom" element = {<CreateClassroom />} />
                  <Route exact path="/editClassroom" element = {<EditClassroom />} />
                  <Route exact path="/dashboard" element = {<Dashboard />} />
                  <Route exact path="/admin/users" element={<Users/>}/>
                  <Route exact path="/admin/user/studyevent" element={<UserEvent/>}/>
                  <Route exact path="/admin/user/participation" element={<UserParticipation/>}/>

                  {/* <Route exact path={["/", "/home"]} component={Home} />
                  <Route exact path="/register" component={Register} />
                  <Route exact path="/profile" component={Profile} />
                  */}
              </Routes>
              {/* </Box> */}
          </Container>
          <AuthVerify logOut={this.logOut}/>
        </>
    );
  }
}