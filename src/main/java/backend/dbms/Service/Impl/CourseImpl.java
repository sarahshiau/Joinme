package backend.dbms.Service.Impl;

import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

import org.hibernate.PropertyValueException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import backend.dbms.Service.CourseService;
import backend.dbms.models.Course;
import backend.dbms.repository.CourseDao;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Service
public class CourseImpl implements CourseService {
    
    @Autowired
    private CourseDao courseDao;

    @Override
    public Long createCourse(Course course) {
        return courseDao.save(course).getCourseId();
    }

    @Override
    public Optional<Course> getByCourseId(Long id) {
        return courseDao.findById(id);
    }

    @Override
    public Long count() {
        return courseDao.count();
    }

    @Override
    public List<Course> searchByCourseOrInstructor(String courseName, String instructorName) {
        return courseDao.findByCourseNameLikeOrInstructorNameLike(courseName, instructorName);
    }

    @Override
    public List<String> getAllCoursesName(){
        return courseDao.findAllCourseName();
    }

    @Override
    public Long updateCourse(Course course) {
        return courseDao.save(course).getCourseId();
    }

    @Override
    public void deleteCourse(Long courseId) {
        courseDao.deleteById(courseId);
    }

    @Override
    public Page<Course> searchCourse(Long courseId, String courseName, String instuctorName, String departmentName, int page, int row){
        Pageable pageable = PageRequest.of(page,row, Sort.by("departmentName"));
        return courseDao.findByMultiCon(courseId, courseName, instuctorName, departmentName, pageable);
    }
    
    @Override
    // 該註解可協助交易管理
    @Transactional
    // 將課程分別存入資料庫，若在過程中出現 exception 資料庫會將此次交易 rollback
    public void uploadCourses(List<Course> courses)throws PropertyValueException{
        try{
            for(Course course:courses){
                courseDao.save(course);
            }
        }
        catch(PropertyValueException e){
            e.printStackTrace();
        }
        
    }
}
