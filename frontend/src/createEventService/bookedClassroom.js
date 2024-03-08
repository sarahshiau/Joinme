import TableBody from '@mui/material/TableBody'
import Box from '@mui/material/Box';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import axios from 'axios';
import { useEffect, useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs'
import moment from 'moment/moment'
import ClassroomRow from './classroomRow'
import Container from '@mui/material/Container';
import authHeader from 'authService/authHeader';


async function searchClassroom(date){
    console.log(date)
    // date= `${date.getFullYear()}/${(date.getMonth()+1)}/${date.getDate()}`;
    return  await axios.post('/api/classroom/booked', {date}, { headers: {'content-type': 'application/json',Authorization:authHeader().Authorization}})
    .then((data)=>{return data.data})
}
function formList(classroomList){
    console.log(classroomList)
    let classroomMap = new Map()
    for(var i =0; i<classroomList.length; i++){
        var buildingRoom = classroomMap.get(classroomList[i].classroom.buildingName) || []
        buildingRoom.push([classroomList[i].classroom,classroomList[i].periodList])
        classroomMap.set(classroomList[i].classroom.buildingName,buildingRoom)
    }
    console.log(classroomMap)
    return classroomMap     
    
}
function filter(classroomList,time){
  
  const result=[...classroomList.entries()].map((classrooms)=>(
    classrooms[1].filter((pair)=>(pair[1][time]===0)).map((pair)=>({classroom:pair[0],periodList:pair[1]}))
      
  ))
    return result.flat()
}
export default function BookedClassroom(){
    const [date, setDate] = useState( moment(new Date()).format('YYYY-MM-DD'));
    const [time, setTime] = useState(0);
    const [loading, setLoading] = useState(false);
    const [AllClassroomList, setAllClassroomList] = useState(new Map());
    const [classroomList,setClassroomList] = useState(new Map());
    const [selectedBtn, setSelectedBtn] = useState({
      date:date,
      classroomName:"",
      periodList:[]
    })
    useEffect(()=>{
        setLoading(true)
        searchClassroom(date).then((data)=>{
            setAllClassroomList(formList(data))
            setClassroomList(formList(data))
            setSelectedBtn({
              date:date,
              classroomName:"",
              periodList:[]
            })
            setLoading(false)
        })
        
    },[date])

    useEffect(()=>{
      setSelectedBtn({
        date:date,
        classroomName:"",
        periodList:[]
      })
      setClassroomList(formList(filter(AllClassroomList,time)))
    }, [time])

    function selectBtn(classroomName,period){
      if(selectedBtn.classroomName===""){
        document.getElementById(classroomName+":"+period).style.backgroundColor="#66B3FF"
        document.getElementById(classroomName+"btn").hidden=false
        setSelectedBtn({
          date:date,
          classroomName:classroomName,
          periodList:[period]
        })
      }
      else if(classroomName === selectedBtn.classroomName){
        if (selectedBtn.periodList.includes(period)){
          if(selectedBtn.periodList.length===3 && period===selectedBtn.periodList[1]){
            alert("時段需要連續")
          }
          else{
            const i = selectedBtn.periodList.indexOf(period) 
            selectedBtn.periodList.splice(i,1)
            document.getElementById(classroomName+":"+period).style.backgroundColor=""
            document.getElementById(classroomName+"btn").hidden=(selectedBtn.periodList.length===0)?true:false
            setSelectedBtn({
              date:date,
              classroomName:(selectedBtn.periodList.length===0)?"":classroomName,
              periodList:selectedBtn.periodList
            }) 
          }
        }
        else{
          if(selectedBtn.periodList.length===3){
            alert("只能選三個連續時段")
          }
          else{
            if(selectedBtn.periodList.includes(period-1)||selectedBtn.periodList.includes(period+1)){
              document.getElementById(classroomName+":"+period).style.backgroundColor="#66B3FF"
              setSelectedBtn({
                date:date,
                classroomName:classroomName,
                periodList:[...selectedBtn.periodList, period].sort()
              })
            }
            else{
              alert("請選擇連續的時段")
            }
          }
        }
        
      }
      else{
        alert("請選擇相同教室")
      }
    }
    
    useEffect(()=>{
      console.log(selectedBtn)
    }, [selectedBtn])

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
          <Container>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker','desktopTimePicker']}>
                <DemoItem>
                  <DatePicker
                      disablePast = {true}
                      value = {dayjs(date+1)}
                      shouldDisableDate={(date)=>{
                          return date.date()>new Date().getDate()+7}}
                      formatDate={(date) => moment(date).format('DD-MM-YYYY')}
                      onChange={(newDate) => {
                        newDate = moment(new Date(newDate.year(),newDate.month(),newDate.date())).format('YYYY-MM-DD')
                        setDate(newDate)}}
                  />
                </DemoItem>
                <DemoItem>
                  <TimePicker  
                    // timeSteps={{minutes:30}}
                    label="時段"
                    ampm={false}
                    minTime={moment("9:00", "HH:mm")}
                    maxTime={moment("21:00", "HH:mm")}
                    views={["hours"]}
                    format='hh:ss'
                    // defaultValue={dayjs("0000-00-00T9:00")}
                    onChange={(newTime)=>{
                      console.log(newTime)
                      console.log(newTime.get('hour'))
                      setTime(newTime.get('hour'))}}
                  />

                </DemoItem>
              </DemoContainer>
              
          </LocalizationProvider>
          <TableBody>
          {/* {classroomList.forEach(function(value, key){
              <Row building = {value} classroomList = {key} />
          })} */}
          {
              [...classroomList.entries()].map((pair)=>(
                  <ClassroomRow buildingName = {pair[0]} classrooms = {pair[1]} desiredTime = {time} selectBtn={selectBtn} selectedBtn = {selectedBtn}/>
              ))
          }
          </TableBody>
          </Container>
          </>
        )
      }
      
        </>
    )
}