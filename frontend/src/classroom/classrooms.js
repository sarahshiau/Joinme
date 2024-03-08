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
import ClassroomTable from './classroomTable';






export default function Classrooms () {
  const [form, setForm] = useState([])
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(0)
  const [classroomId, setClassroomId] = useState(null)
  const [roomName, setRoomName] = useState(null)
  const [buildingName, setBuildingName] = useState(null)


  useEffect(()=>{
    SearchClassroom(page)
  },[page])

  async function SearchClassroom () {
    console.log(223)
     axios.get('http://localhost:8080/api/classrooms' ,{ 
      params:{
        page:page,
        row:20,
        ...(classroomId!==null&& classroomId && {classroomId:classroomId}),
        ...(roomName!==null&& roomName && {roomName:encodeURI(roomName)}),
        ...(buildingName!==null&& buildingName&& {buildingName:encodeURI(buildingName)}),
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

    
   

  return (
    <>
        <br></br>
              <div className='card'>
                <h5 className='card-header' align='center'>
                  瀏覽教室
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
                      id='classroomId'
                      label='教室代號'
                      value={classroomId}
                      onChange={(e)=>setClassroomId(e.target.value)}
                    />
                </Grid>
                <Grid item >
                    <TextField
                      id='roomName'
                      label='教室名稱'
                      value={roomName}
                      onChange={(e)=>{setRoomName(e.target.value)
                        console.log(e.target.value)}}
                    />
                </Grid>
                <Grid item >
                    <TextField
                      id='buildingName'
                      label='建物名稱'
                      value={buildingName}
                      onChange={(e)=>setBuildingName(e.target.value)}
                    />
                </Grid>
                <Grid item >
                    <IconButton  aria-label="search" onClick={SearchClassroom} >
                      <SearchIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Box>
                  
                </div>
              </div>
            <br></br>
        <ClassroomTable classrooms={form} page={page} setPage={setPage} totalPage={totalPage} setTotalPage={setTotalPage} />
    </>
  )
}
