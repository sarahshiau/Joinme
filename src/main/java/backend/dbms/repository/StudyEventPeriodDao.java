package backend.dbms.repository;

import java.sql.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.stereotype.Repository;

import backend.dbms.models.Classroom;
import backend.dbms.models.StudyEvent;
import backend.dbms.models.StudyEventPeriod;
import jakarta.persistence.LockModeType;

@Repository
public interface StudyEventPeriodDao extends JpaRepository<StudyEventPeriod,Long> {
    List<StudyEventPeriod> findByEvent(StudyEvent studyEvent);
    List<StudyEventPeriod> findByEventDateBetween(Date startDate, Date endDate);
    List<StudyEventPeriod> findByEventDate(Date date);
    List<StudyEventPeriod> findByClassroomAndEventDate(Classroom classroom, Date date);
    List<StudyEvent> findAllByEventDateBetween(Date startDate,Date endDate);
}
