package backend.dbms.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import backend.dbms.models.StudyEvent;
import backend.dbms.controllers.DTO.MyParticipationDTO;
import backend.dbms.models.Participation;
import backend.dbms.models.ParticipationId;
import backend.dbms.models.Status;
import backend.dbms.models.User;

@Repository
public interface ParticipationDao extends JpaRepository<Participation, StudyEvent> {
  List<Participation> findByUser(User user);
  void deleteByUserAndEvent(User user, StudyEvent event);
  long countByEvent(StudyEvent event);
  @Query(value="Select p.event.eventId From Participation as p where p.user = :user")
  List<Long> findEventIdByUser(User user);
  @Query(value ="""
      Select sep.event.eventId as eventId, sep.event.course.courseName as courseName, sep.event.course.instructorName as instructorName, sep.classroom.roomName as roomName, group_concat(sep.eventPeriod) as periodList, sep.eventDate as eventDate, sep.event.content as content, sep.event.status as status
      From StudyEventPeriod as sep Left join Participation as p on sep.event = p.event 
      Where p.user = :user and sep.event.status=:status
      group by sep.event
      """)
  Page<MyParticipationDTO> findMyParticipation(@Param("user") User user, @Param("status") Status status, Pageable pageable);

}
