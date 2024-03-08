import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react'

export default function BookedPrompt(props){
    const {roomName,selectedBtn} = props
    const [open, setOpen] = useState(false);
    
    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
      console.log(selectedBtn)
    };
  
    function nextPage(){
      sessionStorage.setItem("bookedInfo",JSON.stringify(selectedBtn))
      window.location.href="/createEvents"
    }
  
    return (
      <Box textAlign="right">
        <Button variant="outlined" onClick={handleClickOpen} id={roomName+"btn"} hidden>
          Submit
        </Button>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            以下為預約資訊
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              教室：{selectedBtn.classroomName}
            </DialogContentText>   
            <DialogContentText>
              預約日期：{selectedBtn.date}
            </DialogContentText>  
            <DialogContentText>
              預約時段：{selectedBtn.periodList[0]}:00 - {(selectedBtn.periodList[selectedBtn.periodList.length-1]+1)}:00
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} autoFocus>取消</Button>
            <Button onClick={nextPage}>
            確定，下一步
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }