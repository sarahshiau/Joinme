package backend.dbms.Service.Impl;

import java.sql.Date;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.stereotype.Service;

import backend.dbms.Service.Pair;
import backend.dbms.Service.StudyEventPeriodService;
import backend.dbms.models.Classroom;
import backend.dbms.models.StudyEvent;
import backend.dbms.models.StudyEventPeriod;
import backend.dbms.repository.EventId;
import backend.dbms.repository.StudyEventPeriodDao;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Service
public class StudyEventPeriodImpl implements StudyEventPeriodService {


    @Autowired
    private StudyEventPeriodDao eventPeriodDao;

    public void createEventPeriod(StudyEventPeriod eventPeriod){
        eventPeriodDao.save(eventPeriod);
    }
    @Autowired
    EntityManager em;
    @Override
    public boolean checkTimeAvailable(Classroom classroom, Date date, List<Integer> periodList) {

        // 查詢該教室當天的預約時段，並將 study_event_period 上鎖
        List<StudyEventPeriod> bookedPeriodList = em.createQuery("Select sep From StudyEventPeriod as sep where sep.classroom=:classroom and sep.eventDate=:date",StudyEventPeriod.class)
            .setParameter("classroom", classroom)
            .setParameter("date", date)
            .setLockMode(LockModeType.PESSIMISTIC_READ)
            .getResultList();
        // List<StudyEventPeriod> bookedPeriodList = eventPeriodDao.findByClassroomAndEventDate(classroom, date);
        for(StudyEventPeriod bookedPeriod: bookedPeriodList){
            // 若想預約的時段出現在已被預約時段 list 中，回傳 false
            if(periodList.contains(bookedPeriod.getEventPeriod())){
                return false;
            }
        }
        return true;
    }

    @Override
    public List<StudyEvent> getEventByDate(Date date){
        return eventPeriodDao.findAllByEventDateBetween(date,new Date(date.getTime() + 1000 * 60 * 60 * 24 *7));
    }

    @Override
    // 七天內指定教室被預約的時間
    public int[][] findBookedTime(Classroom classroom, Date date){
        int[][] periodList = new int[8][24];
        for(int i = 0 ;i<=7;i++){
            for(int j = 0;j<=23;j++){

                periodList[i][j]=0;
            }
        }
        List<StudyEventPeriod> eventPeriodList = eventPeriodDao.findByEventDateBetween(date,new Date(date.getTime()+ 1000 * 60 * 60 * 24 *7));
        for(StudyEventPeriod eventPeriod:eventPeriodList){
            int day = (int)((eventPeriod.getEventDate().getTime()-date.getTime())/86400000);
            periodList[day][eventPeriod.getEventPeriod()] = 1;
        }
        return periodList;
        // List<StudyEvent> eventList = studyEventImpl.getByDateRange(date,new Date(date.getTime()+ 1000 * 60 * 60 * 24 *7));
        // for(StudyEvent event: eventList){
        //     int day = (int)((event.getEventDate().getTime()-date.getTime())/86400000);
        //     for(StudyEventPeriod eventPeriod:eventPeriodDao.findByEvent(event)){
        //         periodList[day][eventPeriod.getEventPeriod()] = 1;
        //     }
        // }
    }

    
}
