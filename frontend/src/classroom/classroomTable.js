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
import Button from '@mui/material/Button'
import axios from 'axios';
import authHeader from 'authService/authHeader'
import AddIcon from "@mui/icons-material/Add";
function deleteBtn(classroomId){
  function deleteClassroom(classroomId){
     axios.delete('http://localhost:8080/api/classroom' ,{
      params:{
        classroomId
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
        alert("該教室可能已被讀書活動綁定或遭遇其他技術問題無法刪除")
      })
  }
  return (
    <Button onClick={()=>deleteClassroom(classroomId)}>刪除教室</Button>
  )
}
function Row (props) {
    const { classroom } = props
 
    // 設定使用者下拉式選單開闔
    return (
      <>
        <TableRow sx={{ borderBottom: 1 }} id={'classroomId' +classroom.classroomId}>
          <TableCell align='right'>{classroom.classroomId}</TableCell>
          <TableCell align='right'>{classroom.buildingName}</TableCell>
          <TableCell align='right'>{classroom.floorNumber}</TableCell>
          <TableCell align='right'>{classroom.roomName}</TableCell>
          <TableCell align='right'>{classroom.capacitySize}</TableCell>
          <TableCell align='right'><Button onClick={()=>window.location.href="editClassroom?classroomId="+classroom.classroomId}>編輯課程</Button></TableCell>
          <TableCell align='right'>{deleteBtn(classroom.classroomId)}</TableCell>
        </TableRow>
  
      </>
    )
  }

export default function ClassroomTable(props){
    const{ classrooms, page, setPage, totalPage }=props
    console.log(props)
    return (
        <TableContainer component={Paper}>
            
        
        <Table aria-label='collapsible table'>
          <TableHead>
            <TableRow>
              <TableCell align='right'>教室代號</TableCell>
              <TableCell align='right'>建物名稱</TableCell>
              <TableCell align='right'>所在樓層</TableCell>
              <TableCell align='right'>教室名稱</TableCell>
              <TableCell align='right'>容量上限</TableCell>
              <TableCell 
                align='right'
                colSpan={2}
               >
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  sx={{ lineHeight: 0 }}
                  onClick={()=>window.location.href = 'createClassroom'}
                >
                  新增教室
                </Button>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {classrooms.map((classroom)=><Row key={classroom.classroomId} classroom={classroom} />)} 
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