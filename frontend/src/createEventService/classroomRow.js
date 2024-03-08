import { useEffect, useState } from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Box from '@mui/material/Box';
import ClassroomBlock from './classroomBlock'


export default function ClassroomRow(props){
    const [open, setOpen] = useState(false)
    const {buildingName, classrooms, desiredTime, selectBtn, selectedBtn} = props
      // console.log(buildingName)
      // console.log(classrooms)
    return (
      <>
        <TableRow  sx={{ borderBottom: 1 }}>
          <TableCell>
            <IconButton
              aria-label='expand row'
              size='small'
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell align='center' width="100%">{buildingName}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell width="100%" style={{ paddingBottom: 1, paddingTop: 0, margin: 2 }} colSpan={6}>
            <Collapse in={open} timeout='auto' unmountOnExit>
              <Box sx={{ margin: 1 }}>
                
                {classrooms.map((pair)=>{
                  if(desiredTime!==0){
                    return <ClassroomBlock classroom = {pair[0]} periodList = {pair[1]} selectBtn = {selectBtn} selectedBtn = {selectedBtn}/>
                  }
                  else{
                    if(pair[1][desiredTime]===0){
                      return <ClassroomBlock classroom = {pair[0]} periodList = {pair[1]} selectBtn = {selectBtn} selectedBtn = {selectedBtn}/>
                    }
                  }
                  return ""
                })}
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
  
  
      </>
    )
  }