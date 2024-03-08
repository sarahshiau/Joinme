package backend.dbms.controllers;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.sql.Date;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.List;

import org.apache.commons.io.input.BOMInputStream;
import org.hibernate.PropertyValueException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import com.opencsv.bean.CsvToBeanBuilder;
import com.opencsv.enums.CSVReaderNullFieldIndicator;
import com.opencsv.exceptions.CsvException;

import backend.dbms.Service.Pair;
import backend.dbms.Service.Impl.CourseImpl;
import backend.dbms.controllers.Request.ResDate;
import backend.dbms.models.Classroom;
import backend.dbms.models.Course;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class CourseController {

    @Autowired
    private CourseImpl courseImpl;

    @GetMapping("/courses/search")
    public List<Course> searchByCourseOrInstructor(@RequestParam String keyword) throws UnsupportedEncodingException{
        keyword = URLDecoder.decode(keyword, "UTF-8");
        System.err.println(keyword);
        return courseImpl.searchByCourseOrInstructor("%"+keyword+"%", "%"+keyword+"%");
    }
    @GetMapping("/courses/name")
    public List<String> getAllCourseName() throws UnsupportedEncodingException{
        return courseImpl.getAllCoursesName();
    }
    
    @PostMapping("/course")
    public Long createCourse(@RequestBody Course course){
        return courseImpl.createCourse(course);
    }
    @PutMapping("/course")
    public Long updateCourse(@RequestBody Course course){
        return courseImpl.updateCourse(course);
    }

    @DeleteMapping("/course")
    public void deleteCourse(@RequestParam(value = "courseId") Long courseId){
        courseImpl.deleteCourse(courseId);
    }

    @GetMapping("/course")
    public Course getCourseById(@RequestParam Long courseId){
        return courseImpl.getByCourseId(courseId).get();
    }

    @GetMapping("/courses")
    public Page<Course> search(@RequestParam int page, @RequestParam int row,@RequestParam(required = false) Long courseId, @RequestParam(required = false) String courseName, @RequestParam(required = false) String instructorName, @RequestParam(required = false) String departmentName) throws UnsupportedEncodingException{
        if(courseName!=null){
            courseName = URLDecoder.decode(courseName, "UTF-8");
        }
        if(instructorName!=null){
            instructorName = URLDecoder.decode(instructorName, "UTF-8");
        }
        if(departmentName!=null){
            departmentName = URLDecoder.decode(departmentName, "UTF-8");
        }
        return courseImpl.searchCourse(courseId, courseName, instructorName, departmentName, page-1, row);
    }

    // 將 csv 檔案處理後將課程資訊存入資料庫
    @PostMapping("/upload/courseFile")
    public void postMethodName(@RequestBody MultipartFile file) throws IOException, CsvException {
        Reader reader = new InputStreamReader(new BOMInputStream(file.getInputStream()),"UTF8");
        // CSVReader csvReader = new CSVReaderBuilder(reader).build();
        // List<String[]> rows = csvReader.readAll();
        // for(String[] row:rows){
        //     System.err.println(Arrays.toString(row));    
            
        // }
        // 將 csv 檔轉成 course 物件刪除不必要的 BOM
        List<Course> courses = new CsvToBeanBuilder<Course>(reader)
            .withFieldAsNull(CSVReaderNullFieldIndicator.EMPTY_SEPARATORS)
            .withType(Course.class)
            .build()
            .parse();
        System.err.println(courses);    
        try {
            // 將課程存入資料庫
            courseImpl.uploadCourses(courses);
        } catch (PropertyValueException e) {
            e.printStackTrace();
        }
       
    }
    

}
