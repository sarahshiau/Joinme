package backend.dbms.Service.Impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import backend.dbms.Service.ParticipationService;
import backend.dbms.controllers.DTO.MyEventDTO;
import backend.dbms.controllers.DTO.MyParticipationDTO;
import backend.dbms.models.Participation;
import backend.dbms.models.Status;
import backend.dbms.models.StudyEvent;
import backend.dbms.models.User;
import backend.dbms.repository.ParticipationDao;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Service
public class ParticipationImpl implements ParticipationService {

    @Autowired
    private ParticipationDao participantionDao;

    @Override
    public List<Participation> getByUser(User user) {
        return participantionDao.findByUser(user);
    }

    @Override
    public List<Long> getEventIdByUser(User user) {
        return participantionDao.findEventIdByUser(user);
    }

    @Override
    public void delete(User user, StudyEvent event) {
        participantionDao.deleteByUserAndEvent(user, event);
    }

    @Override
    public long count(StudyEvent event) {
        return participantionDao.countByEvent(event);
    }
    
    @Override
    public void createParticipation(Participation participantion){
        participantionDao.save(participantion);
    }

    @Override
    public Page<MyParticipationDTO> getMyParticipation(User user, int page, int row,Status status){
        Pageable pageable = PageRequest.of(page,row, Sort.by("eventDate"));
        return participantionDao.findMyParticipation(user, status, pageable);
    }
}
