import { Button } from '@mui/material'
import Box from '@mui/material/Box'
import { Container } from '@mui/system'
import axios from 'axios';
import TextField from '@mui/material/TextField'
import { useEffect, useState } from 'react'
import authHeader from 'authService/authHeader';

async function searchCourse(courseId){
    return axios.get('http://localhost:8080/api/course',{
        params:{
            courseId
        },
        headers: authHeader() 
    })
    .then((res)=>{return res.data})
    
} 

export default function EditCourse (){

    const [course, setCourse] = useState({})
    const [courseName, setCourseName] = useState("")
    const [instructorName, setInstructorName] = useState("")
    const [lectureTime, setLectureTime] = useState("")
    const [departmentName, setDepartmentName] = useState("")
    
    useState(()=>{
        let url = new URL(window.location.href);
        let params = url.searchParams;
        var courseId
        for (let pair of params.entries()) {
            if(pair[0]==="courseId"){
                courseId = pair[1]
            }   
        }
        searchCourse(courseId).then((data)=>{
            setCourse(data)
            setCourseName(data.courseName)
            setInstructorName(data.instructorName)
            setLectureTime(data.lectureTime)
            setDepartmentName(data.departmentName)

        })
    })



    async function HandleClick (e) {
      e.preventDefault()
      const newCourse = {
        courseId:course.courseId,
        courseName,
        instructorName,
        lectureTime,
        departmentName    
      }
      console.log(newCourse)
      await axios.put('http://localhost:8080/api/course',newCourse ,{ headers: authHeader() })
      .then((response)=>{
        console.log(response.status===200)
        if(response.status===200){
            alert("更信成功\n課程代號為："+response.data)
            window.location.href='/courses'
        }
        
      })
    //   navigate('/')
    };

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
            
            <div className='col-md-12'>
                <div className='card'>
                    <h5 className='card-header' align='center'>
                    課程資訊
                    </h5>
                    <div className='card-body'>
                        <div className='row'>
                            <div className='col-md-6'>
                                <div className='form-group'>
                                    <label htmlFor='name'>課程名稱</label>
                                </div>
                                <div className='col'>
                                    <TextField  
                                        id = "courseName"
                                        fullWidth
                                        value = {courseName}
                                        onChange={(e)=>setCourseName(e.target.value)}
                                    />
                                </div>
                            </div>
                    

                            
                            
                        </div>
                        <br></br>
                        <div className='row'>
                            <div className='col-md-4'>
                                <div className='form-group'>
                                    <label htmlFor='name'>授課老師</label>
                                </div>
                                <div className='col'>
                                    <TextField  
                                        id = "instructorName"
                                        value = {instructorName}
                                        onChange={(e)=>setInstructorName(e.target.value)}
                                    />
                            
                                </div>
                            </div>
                            <div className='col-md-4'>
                                <div className='form-group'>
                                    <label htmlFor='name'>授課時間</label>
                                </div>
                                <div className='col'>
                                    <TextField  
                                        id = "lectureTime"
                                        value = {lectureTime}
                                        onChange={(e)=>setLectureTime(e.target.value)}
                                    />
                                </div>
                            </div>
                    

                            <div className='col-md-4'>
                                <div className='form-group'>
                                    <label htmlFor='name'>開課對象</label>
                                </div>
                                <div className='col'>
                                    <TextField  
                                        id = "departmentName"
                                        value = {course.departmentName}
                                        onChange={(e)=>setDepartmentName(e.target.value)}
                                    />
                            
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

