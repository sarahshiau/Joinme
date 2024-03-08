import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import Button from '@mui/material/Button'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import axios from 'axios';
import { useEffect, useState } from 'react'
import { NavLink } from 'react-bootstrap'
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Stack from '@mui/material/Stack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs'
import moment from 'moment/moment'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import authHeader from 'authService/authHeader'
import AuthService from 'authService/authService'

function Row (props) {
  const { row } = props
  const event = row[0]
  const myParticipation = row[1]
  // console.log(event)
  // 設定使用者下拉式選單開闔
  const [open, setOpen] = useState(false)

  const btn =(eventId,holderName,myParticipation)=>{
    const user = JSON.parse(localStorage.getItem("user"))
    if (user){
      if (user.username === holderName){
        return "您為活動主辦人"
      }
    }
    
    if (myParticipation.includes(eventId)){
      return "已參加"
    }
    else{
      return (<Button onClick={() => { joinEvent(event.eventId) }}>參加活動</Button>)
    }
    

  }
  return (
    <>
      <TableRow sx={{ borderBottom: 1 }} id={'eventId' + event.eventId}>
        <TableCell>
          <IconButton
            aria-label='expand row'
            size='small'
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        {/* 使用者資料 */}
        <TableCell align='right'>{event.courseName}</TableCell>
        <TableCell align='right'>{event.instructorName}</TableCell>
        <TableCell align='right'>{event.eventDate}</TableCell>
        <TableCell align='right'>{event.periodList[0]}:00 - {event.periodList[event.periodList.length-1]+1}:00</TableCell>
        <TableCell align='right'>{event.roomName}</TableCell>
        {/* <TableCell align='right'>{event.max}</TableCell> */}
        {/* <TableCell align='right'><Button onClick={() => { joinEvent(event.eventId) }}>參加活動</Button></TableCell> */}
        {AuthService.getCurrentRoles().includes("ROLE_USER")&&
        <TableCell align='right'>{btn(event.eventId,event.holderName,myParticipation)}</TableCell>}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 1, paddingTop: 0, margin: 2 }} colSpan={6}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box sx={{ margin: 1 }}>
              
              {/* <TableCell> */}
                <Typography variant='h6' gutterBottom component='div'>
                  活動內容

                </Typography>
                <TextField 
                value={event.content}
                multiline
                fullWidth 
                InputProps={{
                    readOnly: true,
                }} />
                {/* <TableCell align='right'>{row.content}</TableCell> */}
              {/* </TableCell> */}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>


    </>
  )
}


async function searchEvent (page, row, selectedCourse, date) {
  console.log(selectedCourse)
  return await axios.get('http://localhost:8080/api/studyEvents', { 
    params:{
      page:page,
      row:row,
      ...(selectedCourse!==null && {courseName:encodeURI(selectedCourse)}),
      ...(date!==undefined && {eventDate:encodeURI(date)})
    },
    headers: authHeader() })
    .then((data) => { return data.data })
}


async function searchCourseName() {
  return await axios.get('http://localhost:8080/api/courses/name', { headers: authHeader() })
    .then((data) => { return data.data })
}

async function joinEvent (eventId) {
  if (window.confirm('確定要參加？')) {
    console.log(eventId)
    const url = 'http://localhost:8080/api/joins'
    await axios.post(url,{eventId},{ headers: authHeader() }).then((data) => {
      console.log(data)
      window.location.reload()
    })
  }
}

async function formEvent (event) {
  var periodList = JSON.parse("[" + event.periodList + "]");
  return {
    eventId: event.eventId,
    courseName: event.courseName,
    instructorName: event.instructorName,
    roomName: event.roomName,
    eventDate: event.eventDate,
    max: event.max,
    content: event.content,
    periodList: periodList
  }
}

export default function SearchPage () {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState([])
  const [myParticipation, setMyParticipation] = useState([])
  const [page, setPage] = useState(0)
  const [row, setRow] = useState(10)
  const [totalPage, setTotalPage] = useState(0)
  const [courseNameList, setCourseNameList] = useState([])
  const [date, setDate] = useState( undefined );
  const [selectedCourse, setSelectedCourse] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    const response = await searchEvent(page, row, selectedCourse, date)

    console.log(response)
    const totalPage = response.totalPage
    const events=  response.eventDTO
    setTotalPage(totalPage)
    await Promise.all(events.map((event) => (formEvent(event)))).then((res) => {
      setForm(res)
      setLoading(false)
    })
    .catch((e) => {
      console.log(e.message)
    })
    
  }
  useEffect(() => {
    fetchData()
  }, [page,row])

  useEffect(()=>{
    searchCourseName().then((res)=>setCourseNameList(res))
  },[])

  // const fetchJoin = async () => {
  //   const participations = await searchParticipation()
  //   console.log(participations)
  //   const participationList = await Promise.all(participations.map((event) => (formParticipation(event))))
  //   return participationList
  // }
  // useEffect(() => {
    
  //   fetchJoin().then((res) => {
  //     console.log(res)
  //     setMyParticipation(res)
      
  //   })
  //     .catch((e) => {
  //       console.log(e.message)
  //     })
  // }, [])

  return (
    <>
    {loading?
        <Box
          paddingTop={20}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <CircularProgress size={100} />
        </Box>
        :
        (
          <>
          <Box pt={3} pb={2}>
            <Grid 
              container
              spacing={2}
              justifyContent='center'
              display='flex'
              alignItems='center'>
              <Grid item >
                <Autocomplete
                  disablePortal
                  freeSolo
                  options={courseNameList}
                  onChange={(event, value) => setSelectedCourse(value)} 
                  onInputChange={(event, value)=> setSelectedCourse(value)}
                  sx={{ width: 300 }}
                  renderInput={(params) => <TextField {...params} label="課程" />}
                  value={selectedCourse}
                />
              </Grid>
              <Grid item>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        disablePast = {true}
                        value = {dayjs(date+1)}
                        shouldDisableDate={(date)=>{
                            return date.date()>new Date().getDate()+7}}
                        formatDate={(date) => moment(date).format('DD-MM-YYYY')}
                        onChange={(newDate) => {
                          newDate = moment(new Date(newDate.year(),newDate.month(),newDate.date())).format('YYYY-MM-DD')
                          setDate(newDate) 
                        }}
                    />
                  </LocalizationProvider>
                  </Grid>
                  
              <Grid item>
                <Button variant='outlined' onClick={fetchData}>搜尋</Button>
              </Grid>
              <Grid item>
                <FormControl sx={{ m: 1}} size="small">
                    
                    <Select
                      autoWidth={true}
                      value={row}
                      onChange={(value)=>setRow(value.target.value)}
                      sx={{width:80}}
                    >
                      <MenuItem value={10} >10</MenuItem>
                      <MenuItem value={25}>25</MenuItem>
                      <MenuItem value={50}>50</MenuItem>
                    </Select>
                    
                  </FormControl>
              </Grid>
            </Grid>
          </Box>
          <TableContainer component={Paper}>
            <Table aria-label='collapsible table'>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell align='right'>課程名稱</TableCell>
                  <TableCell align='right'>授課老師</TableCell>
                  <TableCell align='right'>活動日期</TableCell>
                  <TableCell align='right'>活動時段</TableCell>
                  <TableCell align='right'>活動地點</TableCell>
                  {AuthService.getCurrentRoles().includes("ROLE_USER")&&
                  <TableCell align='right'></TableCell>}
                  {/* <TableCell align='right' /> */}
                  
                </TableRow>
              </TableHead>
              <TableBody>
                {form.map((event)=><Row key={event.eventId} row={[event,myParticipation]} />)}
              </TableBody>
            </Table>
            <Box display='flex' justifyContent='center'>
            <Stack spacing={2}>
              <Pagination
                count={totalPage}
                onChange={(event,num)=>setPage(num)}
                page={page+1}
                renderItem={(item) => (
                  <PaginationItem
                  
                    slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                    {...item}
                  />
                )}
              />
            </Stack>
            </Box>
          </TableContainer>
          {/* </Box> */}
        </>
        )
      }
    </>
  )
}
