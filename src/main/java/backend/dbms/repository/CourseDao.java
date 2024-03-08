package backend.dbms.repository;

import java.sql.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import backend.dbms.controllers.DTO.StudyEventDTO;
import backend.dbms.models.Course;
import backend.dbms.models.Status;
import backend.dbms.models.User;

@Repository
public interface CourseDao extends JpaRepository<Course,Long> {
    List<Course> findByCourseNameLikeOrInstructorNameLike(String courseName,String instructorName);

    @Query(value = "Select distinct c.courseName From Course c")
    List<String> findAllCourseName();

    @Query(value = """
    Select c
    From Course as c 
    where (:courseId is Null or c.courseId = :courseId) 
    and (:courseName is Null or c.courseName LIKE %:courseName%) 
    and (:instructorName is Null or c.instructorName LIKE %:instructorName%)
    and (:departmentName is Null or c.departmentName LIKE %:departmentName%)
    """) 
    Page<Course> findByMultiCon (@Param("courseId") Long courseId, @Param("courseName") String courseName, @Param("instructorName") String instructorName, @Param("departmentName") String departmentName, Pageable pageable);

}       
