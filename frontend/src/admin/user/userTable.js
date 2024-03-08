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
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import axios from 'axios';
import authHeader from 'authService/authHeader'
import AddIcon from "@mui/icons-material/Add";
import { Navigate } from 'react-router-dom'
import Tooltip from '@mui/material/Tooltip'

function deleteBtn(courseId){
  function deleteCourse(courseId){
     axios.delete('http://localhost:8080/api/course' ,{
      params:{
          courseId
      },
      headers: authHeader()  })
      .then((response)=>{
        console.log(response.status===200)
        if(response.status===200){
            alert("成功新增\n課程代號為："+response.data)
            // window.location.href='/home'
        }
      })
      .catch((e)=>{
        alert("該課程可能已被讀書活動綁定或遭遇其他技術問題無法刪除")
      })
  }
  return (
    <Button onClick={()=>deleteCourse(courseId)}>刪除課程</Button>
  )
}
function Row (props) {
    const { user } = props
 
    // 設定使用者下拉式選單開闔
    const [open, setOpen] = useState(false)
    return (
      <>
        <TableRow sx={{ borderBottom: 1 }} id={'userId' +user.userId}>
          <TableCell>
            <IconButton
              aria-label='expand row'
              size='small'
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell align='right'>{user.userId}</TableCell>
          <TableCell align='right'>{user.userName}</TableCell>
          <TableCell align='right'>{user.email}</TableCell>
          <TableCell align='right'>
            <Tooltip title="查看使用者舉辦的活動" placement="top">
              <Button onClick={()=>window.location.href="/admin/user/studyevent?userId="+user.userId}>{user.totalHold}</Button>
            </Tooltip>
          </TableCell>
          <TableCell align='right'>
            <Tooltip title="查看使用者參與的活動" placement="top">
              <Button onClick={()=>window.location.href="/admin/user/participation?userId="+user.userId}>{user.totalParticipation}</Button>
            </Tooltip>
          </TableCell>
          {/* <TableCell align='right'><Button onClick={()=>window.location.href="editCourse?courseId="+course.courseId}>編輯課程</Button></TableCell> */}
          {/* <TableCell align='right'>{deleteBtn(course.courseId)}</TableCell> */}
        </TableRow>
  
      </>
    )
  }

export default function UserTable(props){
    const{ users, page, setPage, totalPage }=props
    console.log(props)
    return (
        <TableContainer component={Paper}>
            
        
        <Table aria-label='collapsible table'>
          <TableHead>
            <TableRow>
                
              <TableCell />
              <TableCell align='right'>用戶代號</TableCell>
              <TableCell align='right'>用戶名稱</TableCell>
              <TableCell align='right'>信箱</TableCell>
              <TableCell align='right'>舉辦活動次數</TableCell>
              <TableCell align='right'>參與活動次數</TableCell>
            
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user)=><Row key={user.userId} user={user} />)} 
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