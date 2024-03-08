import { Button } from '@mui/material'
import Box from '@mui/material/Box'
import { Container } from '@mui/system'
import { Component } from 'react'
import Paper from '@mui/material/Paper';
import axios from 'axios';
import TextField from '@mui/material/TextField'
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Radio from '@mui/material/Radio';
import { DisplaySettings } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import authHeader from 'authService/authHeader';


function CourseRow(props){
  const {courseList, selectedCourse, setSelectedCourse} = props

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [columnName] = useState(new Map([
    ['courseName',"課程名稱"],
    ['instructorName', '教師名稱'],
    ["departmentName", '授課系所'],
    ['lectureTime', '上課時間']
  ]))
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const selectCourse = (course)=>{
    setSelectedCourse(course)
  }

  useEffect(()=>{
    columnName.set('courseName',"課程名稱")
    columnName.set('instructorName', '教師名稱')
    columnName.set("departmentName", '授課系所')
    columnName.set('lectureTime', '上課時間')
  })
  return (
    <>
     <Paper sx={{ width: '100%', overflow: 'hidden', maxHeight:'100%',boxShadow:8}}>
      <TableContainer sx={{ maxHeight: 300 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              {Object.keys(courseList[0]).filter((column)=>column!=='courseId').map((column) => (
                <TableCell key={column}>
                  {columnName.get(column)}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {courseList
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((course) => {
                return (
                    
                  <TableRow hover role="checkbox" id = {course.courseId} tabIndex={-1}>
                    <TableCell padding="checkbox">
                      <Radio
                        color="primary" 
                        checked={selectedCourse&&selectedCourse.courseId===course.courseId}
                        onChange={()=>{selectCourse(course)}}
                      />
                    </TableCell>
                    {Object.keys(course).filter((column)=>column!=='courseId').map((column) => {
                      const value = course[column];
                      return (
                        <TableCell >
                          {value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={courseList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            '.MuiTablePagination-selectLabel':{
              marginTop:'auto'
            },
            '.MuiTablePagination-displayedRows':{
              marginTop:'auto'
            },
          }}
          
        />
    </Paper>
    </>
  );
}



export default function CreateEvent (){

    const[courseList, setCourseList] = useState()
    const[selectedCourse, setSelectedCourse] = useState(undefined)
    const[roomName, setRoomName] = useState('')
    const[date, setDate] = useState('')
    const[periodList, setPeriodList] = useState([])
    const[max, setMax] = useState('')
    const[content, setContent] = useState('')
    
    useEffect(()=>{
      const bookedInfo = JSON.parse(sessionStorage.getItem("bookedInfo"))
      setRoomName(bookedInfo.classroomName)
      setDate(bookedInfo.date)
      setPeriodList(bookedInfo.periodList)
    },[])

    async function searchClass(){
      const keyword = document.getElementById('keyword').value

      await axios.get('http://localhost:8080/api/courses/search' ,{params: {keyword:encodeURI(keyword)}, headers: authHeader() }).then(
        (data)=>{
          console.log(data)
          setCourseList(data.data)
        })
    }

    async function HandleClick (e) {
      e.preventDefault()
      const event = {
        roomName,
        userMax:max,
        content,
        eventDate: date,
        courseId:selectedCourse.courseId,
        periodList,
        
    
      }
      console.log(event)
      await axios.post('http://localhost:8080/api/studyEvents',event ,{ headers: authHeader() }).then(data => {
        console.log('Success:', data)
      })
      .then(()=>{
        alert("成功新增")
        // window.location.href='/home'
      })
    //   navigate('/')
    };

    useEffect(()=>{
      console.log(courseList)
    },[courseList])
    return (
      <div>
        {/* <MyNavbar /> */}
        <Container>

          {/* <style margin='center' /> */}
          <h2 style={{ color: 'darkblue' }} align='center'>

            {' '}
            創建新活動
          </h2>
          <Box
            component='form'
            sx={{
              '& > :not(style)': { m: 1 }
            }}
            noValidate
            autoComplete='off'
          >
            <div className = 'col-md-12'>
              <div className='card'>
                <h5 className='card-header' align='center'>
                  課程選擇
                </h5>
                <div className='card-body'>
                  <div className='row'>
                    <TextField
                      id='keyword'
                    />
                    <IconButton  aria-label="search" onClick={searchClass} >
                      <SearchIcon />
                    </IconButton>
                  </div>
                  <br></br>
                  <div className='row'>
                    {courseList&&courseList.length!==0?<CourseRow courseList = {courseList} selectedCourse = {selectedCourse} setSelectedCourse = {setSelectedCourse}/>:""}
                  </div>
                </div>
              </div>
            </div>
            <div className='col-md-12'>
              <div className='card'>
                <h5 className='card-header' align='center'>
                  活動資訊
                </h5>
                <div className='card-body'>
                    <div className='row'>
                      <div className='col-md-4'>
                          <div className='form-group'>
                                <label htmlFor='name'>課程</label>
                            </div>
                            <div className='col'>
                               {selectedCourse?selectedCourse.courseName:"尚未選擇課程"}
                            </div>
                      </div>
                      <div className='col-md-4'>
                            <div className='form-group'>
                                <label htmlFor='name'>活動人數上限</label>
                            </div>
                            <div className='col'>
                                <input
                                type='text'
                                id='max'
                                size='big'
                                className='form-control'
                                onChange={(e)=>setMax(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <br></br>
                    <div className='row'>
                        <div className='col-md-4'>
                            <div className='form-group'>
                                <label htmlFor='name'>活動內容</label>
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col'>
                            <TextField 
                                multiline
                                fullWidth 
                                id = "content"
                                onChange={(e)=>setContent(e.target.value)}
                            />
                        
                        </div>
                    
                    </div>
                </div>
              </div>

            </div>
            <div className='col-md-12'>
              <div className='card'>
                <h5 className='card-header' align='center'>
                  預約資訊
                </h5>
                <div className='card-body'>
                    <div className='row'>
                        <div className='col-md-4'>
                            <div className='form-group'>
                                <label htmlFor='name'>活動時間</label>
                            </div>
                            <div className='col'>
                                {date}
                                {" "}
                                {periodList[0]+":00 - "+(periodList[periodList.length-1]+1)+":00"}
                            </div>   
                        </div>
                        <div className='col-md-4'>
                            <div className='form-group'>
                                <label htmlFor='name'>活動地點</label>
                            </div>

                        <div className='col'>
                            {roomName}
                        </div>
                    </div>
                </div>
              </div>
            </div>

            </div>
            <div className='col-md-12' align='center'>
              <p>
                <Button
                  variant='contained'
                  className='btn btn-success'
                  onClick={HandleClick}
                >
                  {' '}
                  新增確認
                </Button>
                  &nbsp;
                <input
                  type='button'
                  className='btn btn-dark'
                  value='返回'
            
                />
              </p>
            </div>
          </Box>
        </Container>
      </div>
    )
}

