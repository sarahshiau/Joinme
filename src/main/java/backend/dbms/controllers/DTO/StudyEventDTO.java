package backend.dbms.controllers.DTO;

import java.sql.Date;
import java.util.List;

import org.springframework.stereotype.Component;

import backend.dbms.models.StudyEvent;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// @Data
// @NoArgsConstructor
// @AllArgsConstructor
@Component
// public class StudyEventDTO {
//     private String eventId;
//     private Date eventDate;
//     private List<Integer> periodList;
//     private String roomName;
//     private String courseName;
//     private String instructorName;
//     private String content;
   
// }
public interface StudyEventDTO {

    String getEventId();
    Date getEventDate();
    String getPeriodList();
    String getRoomName();
    String getCourseName();
    String getInstructorName();
    String getContent();
}