import { Button } from '@mui/material'
import Box from '@mui/material/Box'
import { Container } from '@mui/system'
import axios from 'axios';
import TextField from '@mui/material/TextField'
import { useEffect, useState } from 'react'
import authHeader from 'authService/authHeader';



export default function CreateClassroom (){

    const [roomName, setRoomName] = useState("")
    const [buildingName, setBuildingName] = useState("")
    const [floorNumber, setFloorNumber] = useState("")
    const [capacitySize, setCapacitySize] = useState("")
    
 



    async function HandleClick (e) {
      e.preventDefault()
      const classroom = {
        roomName,
        buildingName,
        floorNumber,
        capacitySize    
      }
      console.log(classroom)
      await axios.post('http://localhost:8080/api/classroom', classroom ,{ headers: authHeader() })
      .then((response)=>{
        console.log(response.status===200)
        if(response.status===200){
            alert("成功新增\n課程代號為："+response.data)
            window.location.href='/classrooms'
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
                    教室資訊
                    </h5>
                    <div className='card-body'>
                        <div className='row'>
                            <div className='col-md-6'>
                                <div className='form-group'>
                                    <label htmlFor='name'>教室名稱</label>
                                </div>
                                <div className='col'>
                                    <TextField  
                                        id = "roomName"
                                        fullWidth
                                        value = {roomName}
                                        onChange={(e)=>setRoomName(e.target.value)}
                                    />
                                </div>
                            </div>
                    

                            
                            
                        </div>
                        <br></br>
                        <div className='row'>
                            <div className='col-md-4'>
                                <div className='form-group'>
                                    <label htmlFor='name'>建物名稱</label>
                                </div>
                                <div className='col'>
                                    <TextField  
                                        id = "buildingName"
                                        value = {buildingName}
                                        onChange={(e)=>setBuildingName(e.target.value)}
                                    />
                            
                                </div>
                            </div>
                            <div className='col-md-4'>
                                <div className='form-group'>
                                    <label htmlFor='name'>所在樓層</label>
                                </div>
                                <div className='col'>
                                    <TextField  
                                        id = "floorNumber"
                                        value = {floorNumber}
                                        onChange={(e)=>setFloorNumber(e.target.value)}
                                    />
                                </div>
                            </div>
                    

                            <div className='col-md-4'>
                                <div className='form-group'>
                                    <label htmlFor='name'>容納上限</label>
                                </div>
                                <div className='col'>
                                    <TextField  
                                        id = "capacitySize"
                                        value = {capacitySize}
                                        onChange={(e)=>setCapacitySize(e.target.value)}
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

