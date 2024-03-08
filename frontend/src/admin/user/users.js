import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import axios from 'axios';
import { useEffect, useState } from 'react'
import { NavLink } from 'react-bootstrap'
import authHeader from 'authService/authHeader'
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Grid from '@mui/material/Grid';
import UserTable from './userTable';






export default function Users () {
  const [form, setForm] = useState([])
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(0)
  const [userId, setUserId] = useState(null)
  const [userName, setUserName] = useState(null)
  const [email, setEmail] = useState(null)

  async function SearchUser () {
     axios.get('http://localhost:8080/api/admin/users' ,{ 
      params:{
        page:page,
        row:20,
        ...(userId!==null&& userId && {userId:userId}),
        ...(userName!==null&& userName && {userName:encodeURI(userName)}),
        ...(email!==null&& email&& {email:encodeURI(email)}),
       },
        headers: authHeader() })
        .then((res) => {
            res = res.data
            console.log(res)
            setForm(res.content)
            setTotalPage(res.totalPages)
          })
            .catch((e) => {
              console.log(e.message)
            })
}
  useEffect(() => {
    SearchUser(page)
  }, [page])

  return (
    <>
        <br></br>
              <div className='card'>
                <h5 className='card-header' align='center'>
                  瀏覽課程
                </h5>
                <div className='card-body'>
                <Box pt={1} pb={1}>
            <Grid 
              container
              spacing={2}
              justifyContent='center'
              display='flex'
              alignItems='center'>
                <Grid item >
                    <TextField
                      id='userId'
                      label='用戶代號'
                      value={userId}
                      onChange={(e)=>setUserId(e.target.value)}
                    />
                </Grid>
                <Grid item >
                    <TextField
                      id='userName'
                      label='用戶名稱'
                      value={userName}
                      onChange={(e)=>setUserName(e.target.value)}
                    />
                </Grid>
                <Grid item >
                    <TextField
                      id='email'
                      label='信箱'
                      value={email}
                      onChange={(e)=>{setEmail(e.target.value)
                        console.log(e.target.value)}}
                    />
                </Grid>
                <Grid item >
                    <IconButton  aria-label="search" onClick={SearchUser} >
                      <SearchIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Box>
                  
                </div>
              </div>
            <br></br>
        <UserTable users={form} page={page} setPage={setPage} totalPage={totalPage} setTotalPage={setTotalPage} />
    </>
  )
}
