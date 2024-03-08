import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import axios from 'axios';
import { useEffect, useState } from 'react'
import { NavLink } from 'react-bootstrap'
import authHeader from 'authService/authHeader'
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import CourseTable from './courseTable';
import Grid from '@mui/material/Grid';






export default function Courses () {
  const [form, setForm] = useState([])
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(0)
  const [courseId, setCourseId] = useState(null)
  const [courseName, setCourseName] = useState(null)
  const [instructorName, setInstructorName] = useState(null)
  const [departmentName, setDepartmentName] = useState(null)

  async function SearchCourse () {
    console.log(instructorName)
     axios.get('http://localhost:8080/api/courses' ,{ 
      params:{
        page:page,
        row:20,
        ...(courseId!==null&& courseId && {courseId:courseId}),
        ...(courseName!==null&& courseName && {courseName:encodeURI(courseName)}),
        ...(instructorName!==null&& instructorName&& {instructorName:encodeURI(instructorName)}),
        ...(departmentName!==null && departmentName && {departmentName:encodeURI(departmentName)}),
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
    SearchCourse(page)
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
                      id='courseId'
                      label='課程代號'
                      value={courseId}
                      onChange={(e)=>setCourseId(e.target.value)}
                    />
                </Grid>
                <Grid item >
                    <TextField
                      id='courseName'
                      label='課程名稱'
                      value={courseName}
                      onChange={(e)=>setCourseName(e.target.value)}
                    />
                </Grid>
                <Grid item >
                    <TextField
                      id='instructorName'
                      label='授課教師'
                      value={instructorName}
                      onChange={(e)=>{setInstructorName(e.target.value)
                        console.log(e.target.value)}}
                    />
                </Grid>
                <Grid item >
                    <TextField
                      id='departmentName'
                      label='開課對象'
                      value={departmentName}
                      onChange={(e)=>setDepartmentName(e.target.value)}
                    />
                </Grid>
                <Grid item >
                    <IconButton  aria-label="search" onClick={SearchCourse} >
                      <SearchIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Box>
                  
                </div>
              </div>
            <br></br>
        <CourseTable courses={form} page={page} setPage={setPage} totalPage={totalPage} setTotalPage={setTotalPage} />
    </>
  )
}
