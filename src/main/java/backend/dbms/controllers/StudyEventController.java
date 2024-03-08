package backend.dbms.controllers;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.sql.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import backend.dbms.models.StudyEvent;
import backend.dbms.models.StudyEventPeriod;
import backend.dbms.Service.Impl.StudyEventImpl;
import backend.dbms.controllers.DTO.MyEventDTO;
import backend.dbms.controllers.DTO.StudyEventDTO;
import backend.dbms.controllers.Request.StudyEventReq;
import backend.dbms.controllers.Response.EventResponse;
import backend.dbms.models.Status;
import backend.dbms.models.User;
import backend.dbms.repository.UserDao;
import backend.dbms.security.jwt.JwtUtils;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", maxAge = 3600)
public class StudyEventController {

    @Autowired
    private StudyEventImpl eventImpl;

    @Autowired
    private UserDao userRepository;

    @Autowired
    private JwtUtils jwtUtils;

    @GetMapping("/allstudyEvents")
    public List<StudyEvent> studyEvents() {
        return eventImpl.getAllGroups();
    }
    @GetMapping("/studyEvents")
    // @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public EventResponse  onGoingStudyEvents(@RequestHeader("Authorization") String token,@RequestParam int page, @RequestParam int row, @RequestParam(required = false) String courseName, @RequestParam(required = false) Date eventDate) throws UnsupportedEncodingException {
        // Page<StudyEventDTO> eventDTO = eventImpl.getAvailableEvent(page,row);
        String userName = jwtUtils.getUserNameFromJwtToken(token.substring(7, token.length()));
        User user = userRepository.findByUsername(userName).get();
        if (courseName!=null){
            courseName = URLDecoder.decode(courseName, "UTF-8");
        }
        
        Page<StudyEventDTO> eventDTO = eventImpl.getEventByMultiCon(user,page,row,courseName,eventDate);
        // return eventDTO;
        return new EventResponse(eventDTO.getContent(),eventDTO.getTotalPages());
  
       
    }
    @PostMapping("/studyEvents")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public String createStudyEvent(@RequestHeader("Authorization") String token,@RequestBody StudyEventReq event){
        String userName = jwtUtils.getUserNameFromJwtToken(token.substring(7, token.length()));
        User user = userRepository.findByUsername(userName).get();
        return eventImpl.createEvent(event,user);
    }
    @GetMapping("/mystudyEvents")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public Page<MyEventDTO> mystudyEvents(@RequestHeader("Authorization") String token,@RequestParam int page, @RequestParam int row, @RequestParam Status status) {
        String userName = jwtUtils.getUserNameFromJwtToken(token.substring(7, token.length()));
        User user = userRepository.findByUsername(userName).get();
        return eventImpl.getMyEvent(user,page-1,row,status);
    }

    @GetMapping("/admin/user/studyEvents")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public Page<MyEventDTO> getUserStudyEvents(@RequestParam Long userId,@RequestParam int page, @RequestParam int row, @RequestParam Status status) {
        User user = userRepository.findById(userId).get();
        return eventImpl.getMyEvent(user,page-1,row,status);
    }

    
}
