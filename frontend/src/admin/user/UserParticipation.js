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


async function SearchParticipation (userId,status,page) {
  return await axios.get('http://localhost:8080/api/admin/user/joins',
  { params:{
    page:page,
    row:20,
    userId:userId,
    status: status
   },
    headers: authHeader() })
    .then((data) => { return data.data })
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

export default function UserParticipation () {
  const [form, setForm] = useState([])
  const [panel, setPanel] = useState("Ongoing");
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(0)
  const [userId, setUserId] = useState()
  const fetchData = async (userId,status,page) => {
    const participations = await SearchParticipation(userId,status,page)
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
        <TabContext value={panel}>
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
          <ParticipationTable participations={form} page={page} setPage={setPage} totalPage={totalPage} status={panel} />
        
      </TabPanel>
      <TabPanel value="Finished">
      <ParticipationTable participations={form} page={page} setPage={setPage} totalPage={totalPage} status={panel} />
      </TabPanel>
      </TabContext>
    </>
  )
}
