import { Button } from '@mui/material'
import Box from '@mui/material/Box'
import { Container } from '@mui/system'
import axios from 'axios';
import TextField from '@mui/material/TextField'
import { useEffect, useState } from 'react'
import authHeader from 'authService/authHeader';



export default function CreateCourse (){

    const [courseName, setCourseName] = useState("")
    const [instructorName, setInstructorName] = useState("")
    const [lectureTime, setLectureTime] = useState("")
    const [departmentName, setDepartmentName] = useState("")
    
 



    async function HandleClick (e) {
      e.preventDefault()
      const course = {
        courseName,
        instructorName,
        lectureTime,
        departmentName    
      }
      console.log(course)
      await axios.post('http://localhost:8080/api/course',course ,{ headers: authHeader() })
      .then((response)=>{
        console.log(response.status===200)
        if(response.status===200){
            alert("成功新增\n課程代號為："+response.data)
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
                                        value = {departmentName}
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

