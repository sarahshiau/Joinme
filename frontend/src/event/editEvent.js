import { Button } from '@mui/material'
import Box from '@mui/material/Box'
import { Container } from '@mui/system'
import { Component } from 'react'
import axios from 'axios';
import authHeader from '../services/auth-header';
import TextField from '@mui/material/TextField'

class EditEvent extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {  
    axios.get('http://localhost:8080/api/events/id', { headers: authHeader() })
    .then((data) => { return data.data })

  }

  render () {
    const navigate = this.props.navigate
    async function HandleClick (e) {
      const eventName = document.getElementById('name').value
      const date = document.getElementById('date').value
      const location = document.getElementById('location').value
      const max = document.getElementById('max').value
      const content = document.getElementById('content').value
      e.preventDefault()
      const event = {
        eventName,
        date,
        location,
        max,
        content

      }
      console.log(event)
      await axios.post('http://localhost:8080/api/events',event ,{ headers: authHeader() }).then(data => {
        console.log('Success:', data)
      })
    //   navigate('/')
    };

    const paperStyle = {
      padding: '40px 10px', width: 1200, margin: '-25px'
    }


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
                  活動資訊
                </h5>
                <div className='card-body'>
                    <div className='row'>
                        <div className='col-md-4'>
                            <div className='form-group'>
                                <label htmlFor='name'>活動名稱</label>
                            </div>
                            <div className='col'>
                                <input
                                type='text'
                                id='name'
                                size='big'
                                className='form-control'
                                />
                            </div>
                        </div>
                        <div className='col-md-4'>
                            <div className='form-group'>
                                <label htmlFor='name'>活動時間</label>
                            </div>
                            <div className='col'>
                                <input
                                type='datetime-local'
                                id='date'
                                size='big'
                                className='form-control'
                                />
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
                                />
                            </div>
                        </div>
                    </div>
                    {/* <div className='row'>
                        <div className='col-md-6'>
                            <div className='form-group'>
                                <label htmlFor='name'>活動地點</label>
                            </div>
                            <div className='col'>
                                <input
                                type='text'
                                id='location'
                                size='big'
                                className='form-control'
                                />
                            </div>
                        </div>
                        
                    </div> */}
                    <br></br>
                    <div className='row'>
                        <div className='col-md-4'>
                            <div className='form-group'>
                                <label htmlFor='name'>活動地點</label>
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col'>
                            <TextField 
                                multiline
                                fullWidth 
                                id = "location"
                            />
                        
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
                            />
                        
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
}
export default EditEvent