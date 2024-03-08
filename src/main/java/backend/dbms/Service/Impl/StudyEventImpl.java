package backend.dbms.Service.Impl;

import java.sql.Date;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Optional;

import javax.xml.crypto.dsig.Transform;

import org.hibernate.query.NativeQuery;
import org.hibernate.query.sql.internal.NativeQueryImpl;
import org.hibernate.transform.Transformers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.stereotype.Service;

import backend.dbms.Service.StudyEventService;
import backend.dbms.controllers.DTO.MyEventDTO;
import backend.dbms.controllers.DTO.StudyEventDTO;
import backend.dbms.controllers.Request.StudyEventReq;
import backend.dbms.models.Classroom;
import backend.dbms.models.Course;
import backend.dbms.models.Status;
import backend.dbms.models.StudyEvent;
import backend.dbms.models.StudyEventPeriod;
import backend.dbms.models.User;
import backend.dbms.repository.StudyEventDao;
import backend.dbms.repository.StudyEventPeriodDao;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import jakarta.persistence.Query;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import backend.dbms.repository.EventId;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Service
public class StudyEventImpl implements StudyEventService{
    @Autowired
    private StudyEventDao eventDao;

    @Autowired
    private CourseImpl courseImpl;


    @Autowired
    private StudyEventPeriodDao eventPeriodDao;

    @Autowired
    private StudyEventPeriodImpl eventPeriodImpl;

    @Autowired
    private ClassroomImpl classroomImpl;

    @Autowired
    private EntityManager entityManager;

    @Override
    public List<StudyEvent> getByStatus(Status status){
        return null;
    }
    @Override
    public Page<StudyEventDTO> getAvailableEvent(int page, int row){
        Date date = new Date(new java.util.Date().getTime());     
        Pageable pageable = PageRequest.of(page,row, Sort.by("id"));
        Page<StudyEventDTO> event = eventDao.findByEventIdJoinStudyEventPeriod(date,new Date(date.getTime()+1000*60*60*24*7),Status.Ongoing, pageable);
        return event;
    }

    @Override
    public Page<StudyEventDTO> getEventByMultiCon(User user, int page, int row, String courseName, Date date){  
        Pageable pageable = PageRequest.of(page,row, Sort.by("eventDate"));
        Date today = new Date(new java.util.Date().getTime());
        return eventDao.findByMultiCon(user, today,new Date(today.getTime()+1000*60*60*24*7),Status.Ongoing, courseName, date, pageable);  
        // Pageable pageable = PageRequest.of(page,row, Sort.by("id"));
        // StringBuilder queryStr = new StringBuilder("""
        //     Select new backend.dbms.controllers.DTO.StudyEventDTO(event.eventId as eventId, co.courseName as courseName, co.instructorName as instructorName, cl.roomName as roomName, group_concat(sep.eventPeriod) as periodList, sep.eventDate as eventDate, event.content as content)
        //     From StudyEventPeriod as sep 
        //     join StudyEvent as event on event=sep.event 
        //     join Classroom as cl on cl=sep.classroom
        //     join Course as co on co=event.course
        //     where event.status=:status """);
        // if(courseName!=null){
        //     queryStr.append(" and co.courseName = :courseName" );
        // }
        // if(date !=null){
        //     queryStr.append(" and sep.eventDate = :eventDate ");
        // }
        // else{
        //     queryStr.append(" and sep.eventDate between :startDate and :endDate ");
        // }
        // queryStr.append(" group by sep.event ");
        // System.err.println(queryStr.toString());
        // TypedQuery<StudyEventDTO> query = entityManager.createQuery(queryStr.toString(),StudyEventDTO.class);
        // // NativeQueryImpl query = entityManager.createNativeQuery(queryStr.toString()).unwrap(NativeQueryImpl.class);
        
        // query.setParameter("status", Status.Ongoing);
        // Date today = new Date(new java.util.Date().getTime());
        // if(courseName!=null){
        //     query.setParameter("courseName", courseName);
        // }
        // if(date !=null){
        //     query.setParameter("eventDate", date);
        // }
        // else{
            
        //     query.setParameter("startDate", today);
        //     query.setParameter("endDate", new Date(today.getTime()+1000*60*60*24*7));
        // }
      // return new PageImpl<>(result, pageable, row);
        
        
    }

    @Override
    public List<StudyEvent> getAllGroups(){
        return eventDao.findAll();
    }

    @Override
    public List<StudyEvent> getByHolder(User user){
        return eventDao.findByHolder(user);
    }

    @Override
    @Transactional
    public void createEvent(StudyEvent event){
        eventDao.save(event);
    }

    @Autowired
    EntityManager em;

    @Override
    @Transactional
    public String createEvent(StudyEventReq eventReq,User user){
        // 取得課程
        Course course = courseImpl.getByCourseId(eventReq.getCourseId()).get();
        // 創建讀書活動
        StudyEvent event = new StudyEvent(user, course, eventReq.getUserMax(), eventReq.getContent(),Status.Ongoing);
        // 取得教室
        Classroom classroom = classroomImpl.getByClassroomName(eventReq.getRoomName()).get();
        // StudyEventPeriod sep = em.find(StudyEventPeriod.class, 1);
        // em.lock(sep, LockModeType.PESSIMISTIC_WRITE);
        // 確認該時段是否可以預約
        if(eventPeriodImpl.checkTimeAvailable(classroom, eventReq.getEventDate(), eventReq.getPeriodList())){
            // 新增讀書活動至資料庫
            eventDao.save(event);
            // 將時段資訊分別存入
            for(Integer period: eventReq.getPeriodList()){
                StudyEventPeriod eventPeriod = new StudyEventPeriod(event,classroom,eventReq.getEventDate(),period);
                eventPeriodImpl.createEventPeriod(eventPeriod);
            }
        }
        else{
            return "Duplicate";
        }
        // em.lock(sep, LockModeType.NONE);
        return "Success";        
    }

    @Override
    public Optional<StudyEvent> getByEventId(Long id){
        return eventDao.findById(id);
    }
    @Override
    public long count(){
        return eventDao.count();
    }
    @Override
    public Page<MyEventDTO> getMyEvent(User user, int page, int row,Status status){
        Pageable pageable = PageRequest.of(page,row, Sort.by("eventDate"));
        return eventDao.findMyEvent(user, status, pageable);
    }
    // @Override
    // public List<StudyEvent> getByClassroomAndDate(Classroom classroom, Date date) {
    //     return eventDao.findByClassroomAndEventDate(classroom, date);
    // }

    // @Override
    // public List<EventId> getBookedPeriod(Classroom classroom, Date date) {
    //     return eventDao.findAllByClassroomAndEventDate(classroom, date);
    // }

    // @Override
    // public List<StudyEvent> getByDateRange(Date starDate, Date endDate) {
    //     return eventDao.findByEventDateBetween(starDate, endDate);
    // }

    // @Override
    // public List<StudyEvent> getByDate(Date date) {
    //     return eventDao.findByEventDate(date);
    // }
}
