package backend.dbms.Service;

import java.util.List;

import org.springframework.data.domain.Page;

import backend.dbms.controllers.DTO.MyParticipationDTO;
import backend.dbms.models.Participation;
import backend.dbms.models.Status;
import backend.dbms.models.StudyEvent;
import backend.dbms.models.User;

public interface ParticipationService {

    List<Participation> getByUser(User user);
    void delete(User user, StudyEvent event);
    long count(StudyEvent event);
    void createParticipation(Participation participantion);
    List<Long> getEventIdByUser(User user);
    Page<MyParticipationDTO> getMyParticipation(User user, int page, int row, Status status);
}
