package backend.dbms.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import backend.dbms.models.StudyEvent;
import backend.dbms.models.StudyEventPeriod;
import backend.dbms.controllers.DTO.MyEventDTO;
import backend.dbms.controllers.DTO.StudyEventDTO;
import backend.dbms.models.Classroom;
import backend.dbms.models.Status;
import backend.dbms.models.User;

import java.sql.Date;
import java.util.List;


@Repository
public interface StudyEventDao extends JpaRepository<StudyEvent, Long> {
  List<StudyEvent> findByStatus(Status Status);
  List<StudyEvent> findByHolder(User holder);

  @Query(value = """
    Select event.eventId as eventId, co.courseName as courseName, co.instructorName as instructorName, cl.roomName as roomName, group_concat(sep.eventPeriod) as periodList, sep.eventDate as eventDate, event.content as content 
    From StudyEventPeriod as sep inner join sep.event as event join sep.classroom as cl join sep.event.course as co 
    where sep.eventDate between :startDate and :endDate and event.status=:status group by event.eventId"""
    )
  // @Query(value = """
  //   Select sep.event.eventId as eventId, sep.event.course.courseName as courseName, sep.event.course.instructorName as instructorName, sep.classroom.roomName as roomName, group_concat(sep.eventPeriod) as periodList, sep.eventDate as eventDate, sep.event.content as content 
  //   From StudyEventPeriod as sep 
  //   where sep.eventDate between :startDate and :endDate and sep.event.status=:status group by sep.event"""
    // )
  Page<StudyEventDTO> findByEventIdJoinStudyEventPeriod (@Param("startDate") Date startDate, @Param("endDate") Date endDate, @Param("status") Status status, Pageable pageable);

  //  @Query(value = """
  //   Select event.eventId as eventId, co.courseName as courseName, co.instructorName as instructorName, cl.roomName as roomName, group_concat(sep.eventPeriod) as periodList, sep.eventDate as eventDate, event.content as content 
  //   From StudyEventPeriod as sep join sep.event as event join sep.classroom as cl join sep.event.course as co 
  //   where event.holder != :holder and event.status=:status and sep.eventDate between :startDate and :endDate
  //   and (:courseName is Null or co.courseName LIKE %:courseName%) 
  //   and (:eventDate is Null or sep.eventDate=:eventDate)
  //   group by sep.event"""
  //   )
    @Query(value = """
    Select sep.event.eventId as eventId, sep.event.course.courseName as courseName, sep.event.course.instructorName as instructorName, sep.classroom.roomName as roomName, group_concat(sep.eventPeriod) as periodList, sep.eventDate as eventDate, sep.event.content as content 
    From StudyEventPeriod as sep Left Join Participation as p on p.user = :user and sep.event = p.event 
    where p.user = Null and sep.event.holder != :user and sep.event.status=:status and sep.eventDate between :startDate and :endDate 
    and (:courseName is Null or sep.event.course.courseName LIKE %:courseName%) 
    and (:eventDate is Null or sep.eventDate=:eventDate)
    group by sep.event"""
    ) 
  Page<StudyEventDTO> findByMultiCon (@Param("user") User user, @Param("startDate") Date startDate, @Param("endDate") Date endDate, @Param("status") Status status, @Param("courseName") String courseName, @Param("eventDate") Date date, Pageable pageable);

  @Query(value ="""
      Select sep.event.eventId as eventId, sep.event.course.courseName as courseName, sep.event.course.instructorName as instructorName, sep.classroom.roomName as roomName, group_concat(sep.eventPeriod) as periodList, sep.eventDate as eventDate, sep.event.content as content, sep.event.status as status, count(distinct(p.user)) as totalParticipation
      From StudyEventPeriod as sep Left join Participation as p on sep.event = p.event 
      Where sep.event.holder = :user and sep.event.status=:status
      group by sep.event
      """)
      // @Query(value ="""
      // Select sep.event.eventId as eventId, sep.event.course.courseName as courseName, sep.event.course.instructorName as instructorName, sep.classroom.roomName as roomName, group_concat(sep.eventPeriod) as periodList, sep.eventDate as eventDate, sep.event.content as content 
      // From StudyEventPeriod as sep 
      // Where sep.event.holder = :user and sep.event.status = :status
      // group by sep.event
      // """)
  Page<MyEventDTO> findMyEvent(@Param("user") User user, @Param("status") Status status, Pageable pageable);

  // List<StudyEvent> findByClassroomAndEventDate(Classroom classroom, Date date);
  // List<EventId> findAllByClassroomAndEventDate(Classroom classroom, Date date);
  // List<StudyEvent> findByEventDateBetween(Date startDate, Date endDate);
  // List<StudyEvent> findByEventDate(Date date);
}
