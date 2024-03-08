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
    const { course } = props
 
    // 設定使用者下拉式選單開闔
    const [open, setOpen] = useState(false)
    return (
      <>
        <TableRow sx={{ borderBottom: 1 }} id={'courseId' +course.courseId}>
          <TableCell>
            <IconButton
              aria-label='expand row'
              size='small'
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell align='right'>{course.courseId}</TableCell>
          <TableCell align='right'>{course.courseName}</TableCell>
          <TableCell align='right'>{course.instructorName}</TableCell>
          <TableCell align='right'>{course.lectureTime}</TableCell>
          <TableCell align='right'>{course.departmentName}</TableCell>
          <TableCell align='right'><Button onClick={()=>window.location.href="editCourse?courseId="+course.courseId}>編輯課程</Button></TableCell>
          <TableCell align='right'>{deleteBtn(course.courseId)}</TableCell>
        </TableRow>
  
      </>
    )
  }

export default function CourseTable(props){
    const{ courses, page, setPage, totalPage }=props
    console.log(props)
    return (
        <TableContainer component={Paper}>
            
        
        <Table aria-label='collapsible table'>
          <TableHead>
            <TableRow>
                
              <TableCell />
              <TableCell align='right'>課程代號</TableCell>
              <TableCell align='right'>課程名稱</TableCell>
              <TableCell align='right'>授課教師</TableCell>
              <TableCell align='right'>開課時間</TableCell>
              <TableCell align='right'>開課對象</TableCell>
              <TableCell 
                align='right'
                colSpan={2}
               >
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  sx={{ lineHeight: 0 }}
                  onClick={()=>window.location.href = 'createCourse'}
                >
                  新增課程
                </Button>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((course)=><Row key={course.courseId} course={course} />)} 
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