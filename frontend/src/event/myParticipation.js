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
import authHeader from 'authService/authHeader'
import TabPanel from '@mui/lab/TabPanel';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import EventTable from './eventTable'
import ParticipationTable from './participationTable'


async function SearchParticipation (status, page) {
  return await axios.get('http://localhost:8080/api/myjoins',
  { params:{
    page:page,
    row:20,
    status: status
   },
    headers: authHeader() })
    .then((data) => { return data.data })
}

async function deleteParticipant(id) {
  if (window.confirm('確定要取消參加？')) {
    const url = 'http://localhost:8080/api/joins'
    await axios.delete(url,{ headers: authHeader(),data:{eventId:id} }).then((data) => {
      console.log(data)
      window.location.reload()
    })
  }
}

async function formParticipation (participation) {
  console.log(participation)
  var joinDate;
  var periodList = JSON.parse("["+participation.periodList+"]");
  // if (participation.date.includes("T")){
  //   joinDate = participation.date.split("T")[0]+" "+participation.date.split("T")[1].split(".")[0]
  // }
  // else{
  //   joinDate = participation.date
  // }
  return {
    // joinDate: joinDate,
    eventId: participation.eventId,
    courseName: participation.courseName,
    instructorName: participation.instructorName,
    roomName: participation.roomName,
    eventDate: participation.eventDate,
    periodList: periodList,
    content: participation.content,
  }
}

export default function MyParticipation () {
  const [form, setForm] = useState([])
  const [panel, setPanel] = useState("Ongoing");
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(0)

  const fetchData = async (status) => {
    const participations = await SearchParticipation(status,page)
    console.log(participations)
    Promise.all(participations.content.map((participation) => (formParticipation(participation)))).then((res) => {
      console.log(res)
      setForm(res)
      setTotalPage(participations.totalPages)
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
          <ParticipationTable participations={form} page={page} setPage={setPage} totalPage={totalPage} status={panel} deleteParticipant={deleteParticipant}/>
        
      </TabPanel>
      <TabPanel value="Finished">
      <ParticipationTable participations={form} page={page} setPage={setPage} totalPage={totalPage} status={panel} deleteParticipant={deleteParticipant}/>
      </TabPanel>
      </TabContext>
    </>
  )
}
