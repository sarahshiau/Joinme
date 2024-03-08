import Button from '@mui/material/Button'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import BookedPrompt from './bookedPrompt'

export default function ClassroomBlock(props){
    const {classroom, periodList, selectBtn, selectedBtn} = props
    // console.log(props)
  
    return(
        <>
            <TableRow >
                <TableCell  width="100%" >{classroom.roomName}</TableCell>
            </TableRow>
            <TableCell sx={{ borderBottom: "none"}} >
                {periodList.map((period,index)=>{
                    if(period===0 && index>=8 && index<=21){
                      return(<Button variant='outlined' style={{ margin: 2 }} id={classroom.roomName+":"+index} onClick={()=>{selectBtn(classroom.roomName,index)}}>{index}:00</Button>)
                    }
                    else if(period===1){
                      return (<Button variant='outlined' style={{ margin: 2 }} disabled>{index}:00</Button>)
                    }
                    return ""
                          })}
            </TableCell>
            <BookedPrompt roomName = {classroom.roomName} selectedBtn = {selectedBtn} />
        </>
    )
  }