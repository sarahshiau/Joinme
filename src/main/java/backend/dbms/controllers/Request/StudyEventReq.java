package backend.dbms.controllers.Request;

import java.sql.Date;
import java.util.List;

import org.springframework.stereotype.Component;

import backend.dbms.models.StudyEvent;
import lombok.Data;

@Data
@Component
public class StudyEventReq {
    private String roomName;
    private Date eventDate;
    private int userMax;
    private String content;
    private Long courseId;
    private List<Integer> periodList;
}
