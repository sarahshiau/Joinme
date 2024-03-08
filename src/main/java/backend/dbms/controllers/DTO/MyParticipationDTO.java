package backend.dbms.controllers.DTO;

import java.sql.Date;

import backend.dbms.models.Status;

public interface MyParticipationDTO {

    String getEventId();
    Date getEventDate();
    String getPeriodList();
    String getRoomName();
    String getCourseName();
    String getInstructorName();
    String getContent();
}
