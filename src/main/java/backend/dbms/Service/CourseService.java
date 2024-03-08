package backend.dbms.Service;

import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

import org.hibernate.PropertyValueException;
import org.springframework.data.domain.Page;

import backend.dbms.models.Course;

public interface CourseService {
    Long createCourse(Course course);
    Optional<Course> getByCourseId(Long id);
    Long count();
    List<Course> searchByCourseOrInstructor(String courseName, String instructorName);
    List<String> getAllCoursesName();
    Long updateCourse(Course course);
    void deleteCourse(Long courseId);
    Page<Course> searchCourse(Long courseId, String courseName, String instuctorName, String departmentName, int page, int row);
    void uploadCourses(List<Course> courses)throws PropertyValueException;
}
