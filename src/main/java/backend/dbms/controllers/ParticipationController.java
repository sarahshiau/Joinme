package backend.dbms.controllers;


import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import backend.dbms.models.StudyEvent;
import backend.dbms.Service.Impl.ParticipationImpl;
import backend.dbms.Service.Impl.StudyEventImpl;
import backend.dbms.Service.Impl.UserImpl;
import backend.dbms.controllers.DTO.MyParticipationDTO;
import backend.dbms.models.Participation;
import backend.dbms.models.Status;
import backend.dbms.models.User;
import backend.dbms.repository.ParticipationDao;
import backend.dbms.repository.UserDao;
import backend.dbms.security.jwt.JwtUtils;
import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ParticipationController {

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserImpl userImpl;

    @Autowired
    private UserDao userRepository;

    @Autowired
    private StudyEventImpl eventImpl;

    @Autowired
    private ParticipationImpl participationImpl;

    @PostMapping("/joins")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public void createParticipant(@RequestHeader("Authorization") String token,@RequestBody StudyEvent event){
        String userName = jwtUtils.getUserNameFromJwtToken(token.substring(7, token.length()));
        User user = userImpl.getByUsername(userName).get();
        event = eventImpl.getByEventId(event.getEventId()).get();
        Date date = new Date();
        Participation participantion = new Participation(user,event,date);
        participationImpl.createParticipation(participantion);
    }

    @GetMapping("/myjoins")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public Page<MyParticipationDTO> findMyParticipation(@RequestHeader("Authorization") String token,@RequestParam int page, @RequestParam int row, @RequestParam Status status){
        String userName = jwtUtils.getUserNameFromJwtToken(token.substring(7, token.length()));
        User user = userImpl.getByUsername(userName).get();
        return participationImpl.getMyParticipation(user, page-1, row, status);
    }
    
    @GetMapping("/admin/user/joins")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public Page<MyParticipationDTO> getUserParticipation(@RequestParam Long userId,@RequestParam int page, @RequestParam int row, @RequestParam Status status){
        User user = userRepository.findById(userId).get();
        return participationImpl.getMyParticipation(user, page-1, row, status);
    }

    @GetMapping("/joins/eventId")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public List<Long> findMyParticipationEventId(@RequestHeader("Authorization") String token){
        String userName = jwtUtils.getUserNameFromJwtToken(token.substring(7, token.length()));
        User user = userImpl.getByUsername(userName).get();
        return participationImpl.getEventIdByUser(user);
    }

    @DeleteMapping("/joins")
    @Transactional
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public void deleParticipant(@RequestHeader("Authorization") String token,@RequestBody StudyEvent event){
        String userName = jwtUtils.getUserNameFromJwtToken(token.substring(7, token.length()));
        System.err.println(event);
        User user = userImpl.getByUsername(userName).get();
        event = eventImpl.getByEventId(event.getEventId()).get();
        // System.err.println(event.toString());
        participationImpl.delete(user, event);
    }

    @PostMapping("/participantAmounts")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public Long getParticipantAmount(@RequestBody StudyEvent event){
        event = eventImpl.getByEventId(event.getEventId()).get();
        System.err.println(participationImpl.count(event));
        return participationImpl.count(event);
    }


}
