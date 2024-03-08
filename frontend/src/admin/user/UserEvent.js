import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import axios from 'axios';
import { useEffect, useState } from 'react'
import { NavLink } from 'react-bootstrap'
import authHeader from 'authService/authHeader'
import TabPanel from '@mui/lab/TabPanel';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import EventTable from './eventTable'



async function SearchEvent (userId,status,page) {
  console.log(userId)
  if(userId!==undefined){
    return await axios.get('http://localhost:8080/api/admin/user/studyEvents',
   { params:{
    page:page,
    row:20,
    userId:userId,
    status: status
   },
    headers: authHeader() })
    .then((data) => { return data.data })
  }
  
}


async function formEvent (event) {
  // var amount = await SearchEventAmount(event.id)
  console.log(event)
  var periodList = JSON.parse("["+event.periodList+"]");
  return {
    courseName: event.courseName,
    instructorName: event.instructorName,
    roomName: event.roomName,
    eventDate: event.eventDate,
    periodList: periodList,
    content: event.content,
    totalParticipation: event.totalParticipation
  }
}

export default function UserEvent () {
  const [form, setForm] = useState([])
  const [panel, setPanel] = useState("Ongoing");
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(0)
  const [userId, setUserId] = useState()
  const fetchData = async (userId,status,page) => {
    const events = await SearchEvent(userId,status,page)
    Promise.all(events.content.map((event) => (formEvent(event)))).then((res) => {
      console.log(res)
      setForm(res)
      setTotalPage(events.totalPages)
    })
      .catch((e) => {
        console.log(e.message)
      })
  }
  useEffect(() => {
    let url = new URL(window.location.href);
        let params = url.searchParams;
        var userId 
        for (let pair of params.entries()) {
            if(pair[0]==="userId"){
              userId=pair[1]
              setUserId(userId)
            }   
        }
      
    fetchData(userId,"Ongoing",page)
  }, [page])

  return (
    <>
    <br></br>
      <Typography>
        以下為使用者代號:{userId}舉辦的活動
      </Typography>
        <TabContext value={panel} >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={(event, value)=>{
            setPanel(value)
            fetchData(userId,value,page)
            }} 
          aria-label="lab API tabs example">
            <Tab label="進行中" value="Ongoing" />
            <Tab label="已結束" value="Finished" />
          </TabList>
        </Box>
        <TabPanel value="Ongoing">
          <EventTable events={form} page={page} setPage={setPage} totalPage={totalPage} setTotalPage={setTotalPage} />
        
      </TabPanel>
      <TabPanel value="Finished">
      <EventTable events={form} page={page} setPage={setPage} totalPage={totalPage} setTotalPage={setTotalPage} />
      </TabPanel>
      </TabContext>
    </>
  )
}
