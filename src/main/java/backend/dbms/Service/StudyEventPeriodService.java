package backend.dbms.Service;

import java.sql.Date;
import java.util.List;



import backend.dbms.models.Classroom;
import backend.dbms.models.StudyEvent;
import backend.dbms.models.StudyEventPeriod;

public interface StudyEventPeriodService {
    boolean checkTimeAvailable(Classroom classroom, Date date, List<Integer> period);
    int[][]  findBookedTime(Classroom classroom, Date date);
    void createEventPeriod(StudyEventPeriod eventPeriod);
    List<StudyEvent> getEventByDate(Date date);
    
}
