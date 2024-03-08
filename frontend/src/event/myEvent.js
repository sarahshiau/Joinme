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



async function SearchEvent (status,page) {
  return await axios.get('http://localhost:8080/api/mystudyEvents',
   { params:{
    page:page,
    row:20,
    status: status
   },
    headers: authHeader() })
    .then((data) => { return data.data })
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

export default function MyEvents () {
  const [form, setForm] = useState([])
  const [panel, setPanel] = useState("Ongoing");
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(0)

  const fetchData = async (status) => {
    const events = await SearchEvent(status,page)
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
    fetchData("Ongoing",page)
  }, [page])

  return (
    <>
        <TabContext value={panel}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={(event, value)=>{
            setPanel(value)
            fetchData(value)
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
