package backend.dbms.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import backend.dbms.models.Classroom;
import jakarta.persistence.LockModeType;

@Repository
public interface ClassroomDao extends JpaRepository<Classroom,Long> {
    @Lock(LockModeType.PESSIMISTIC_READ)
    Optional<Classroom> findWithLockingByRoomName(String roomName); 
    Optional<Classroom> findByRoomName(String roomName); 

    @Query(value = """
    Select c
    From Classroom as c 
    where (:classroomId is Null or c.classroomId = :classroomId) 
    and (:roomName is Null or c.roomName LIKE %:roomName%) 
    and (:buildingName is Null or c.buildingName LIKE %:buildingName%)
    """) 
    Page<Classroom> findByMultiCon (@Param("classroomId") Long classroomId, @Param("roomName") String roomName, @Param("buildingName") String buildingName, Pageable pageable);
}
