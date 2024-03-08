package backend.dbms.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import backend.dbms.controllers.DTO.UserDTO;
import backend.dbms.models.Course;
import backend.dbms.models.User;
import java.util.List;

@Repository
public interface UserDao extends JpaRepository<User, Long> {
  Optional<User> findByUsername(String username);

  Boolean existsByUsername(String username);

  Boolean existsByEmail(String email);

  List<User> findAll();

  @Query(value = """
    Select u.id as userId, u.username as userName, u.email as email, count(distinct(se.id)) as totalHold, count(distinct(p.id)) as totalParticipation
    From User as u 
    left Join StudyEvent as se on se.holder=u
    left Join Participation as p on p.user=u
    where (:userId is Null or u.id = :userId) 
    and (:userName is Null or u.username LIKE %:userName%) 
    and (:email is Null or u.email LIKE %:email%)
    Group by u.id
    """) 
    Page<UserDTO> findByMultiCon (@Param("userId") Long userId, @Param("userName") String userName, @Param("email") String email, Pageable pageable);

}
