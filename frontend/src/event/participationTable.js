import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Stack from '@mui/material/Stack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import Button from '@mui/material/Button'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'

function Row (props) {
    const { participation, status, deleteParticipant } = props

    // 設定使用者下拉式選單開闔
    const [open, setOpen] = useState(false)
    const deleteBtn =(eventStatus)=>{
        if (eventStatus==="In_Progress"){
          return (<Button onClick={() => { deleteParticipant(participation.eventId) }}>取消活動</Button>)
        }
      }
    return (
      <>
        <TableRow sx={{ borderBottom: 1 }} id={'eventId' + participation.eventId}>
          <TableCell>
            <IconButton
              aria-label='expand row'
              size='small'
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell align='right'>{participation.courseName}</TableCell>
          <TableCell align='right'>{participation.instructorName}</TableCell>
          <TableCell align='right'>{participation.eventDate}</TableCell>
          <TableCell align='right'>{participation.periodList[0]}:00 - {participation.periodList[participation.periodList.length-1]+1}:00</TableCell>
          <TableCell align='right'>{participation.roomName}</TableCell>
          {status==="Ongoing"&&<TableCell align='right'><Button onClick={() => { deleteParticipant(participation.eventId) }}>取消活動</Button></TableCell>}
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
                  value={participation.content}
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

export default function ParticipationTable(props){
    const{ participations, page, setPage, totalPage, status, deleteParticipant }=props
    console.log(props)
    return (
        <TableContainer component={Paper}>
            
        
        <Table aria-label='collapsible table'>
          <TableHead>
            <TableRow>
                
              <TableCell />
              <TableCell align='right'>課程名稱</TableCell>
              <TableCell align='right'>授課教師</TableCell>
              <TableCell align='right'>活動時間</TableCell>
              <TableCell align='right'>活動時段</TableCell>
              <TableCell align='right'>活動地點</TableCell>
              {status==="Ongoing"&&<TableCell align='right' />}
            </TableRow>
          </TableHead>
          <TableBody>
            {participations.map((participation)=><Row key={participation.eventId} participation={participation} status={status} deleteParticipant={deleteParticipant} />)} 
            {(participations.length===0)&&
            <TableCell colSpan={7} align='center'>無資料</TableCell>}
          </TableBody>
        </Table>
        <Box display='flex' justifyContent='center'>
            <Stack spacing={2}>
              <Pagination
                count={totalPage}
                onChange={(event,num)=>setPage(num)}
                page={page}
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
    )
}