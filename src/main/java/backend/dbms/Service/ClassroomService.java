package backend.dbms.Service;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;

import backend.dbms.models.Classroom;

public interface ClassroomService {
    long count();
    Optional<Classroom> getByClassroomId(Long id);
    List<Classroom> getAllClassroom();
    List<Pair> findBookedClassroom(Date date);
    Optional<Classroom> getByClassroomName(String roomName);
    Long createClassroom(Classroom classroom);
    Long updateClassroom(Classroom classroom);
    void deleteClassroom(Long classroomId);
    Page<Classroom> searchClassroom(Long classroomId, String roomName, String buildingName, int page, int row);
}
