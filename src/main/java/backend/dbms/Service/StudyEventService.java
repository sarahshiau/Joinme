package backend.dbms.Service;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;

import backend.dbms.controllers.DTO.MyEventDTO;
import backend.dbms.controllers.DTO.StudyEventDTO;
import backend.dbms.controllers.Request.StudyEventReq;
import backend.dbms.models.Classroom;
import backend.dbms.models.Status;
import backend.dbms.models.StudyEvent;
import backend.dbms.models.StudyEventPeriod;
import backend.dbms.models.User;
import backend.dbms.repository.EventId;

public interface StudyEventService {
    List<StudyEvent> getByStatus(Status status);
    List<StudyEvent> getAllGroups();
    List<StudyEvent> getByHolder(User user);
    void createEvent(StudyEvent event);
    String createEvent(StudyEventReq event,User user);
    Optional<StudyEvent> getByEventId(Long id);
    long count();
    Page<StudyEventDTO> getAvailableEvent(int page, int row);
    Page<StudyEventDTO> getEventByMultiCon(User user,int page, int row, String courseName, Date date);
    Page<MyEventDTO> getMyEvent(User user, int page, int row, Status status);
    // List<StudyEvent> getByClassroomAndDate(Classroom classroom, Date date);
    // List<EventId> getBookedPeriod(Classroom classroom, Date date);
    // List<StudyEvent> getByDateRange(Date startDate, Date endDate);
    // List<StudyEvent> getByDate(Date date);
    
}
