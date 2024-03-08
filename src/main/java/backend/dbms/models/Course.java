package backend.dbms.models;

import java.util.Date;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import com.opencsv.bean.CsvBindByName;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;


@NoArgsConstructor
@AllArgsConstructor
@Entity
@Data
@Table(name = "course")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "course_id")
    private Long courseId;

    @NonNull
    @Column(name = "course_name", length = 20,nullable = false)
    @CsvBindByName(column = "course_name")
    private String courseName;

    @NonNull
    @Column(name = "instructor_name", length = 15)
    @CsvBindByName(column = "instructor_name")
    private String instructorName;


    @Column(name = "department_name", length = 20)
    @CsvBindByName(column = "department_name")
    private String departmentName;
    
    @Column(name = "lecture_time", length = 20)
    @CsvBindByName(column = "lecture_time")
    private String lectureTime;

    public Course(String courseName, String instructName, String departmentName, String lectureName){
        this.courseName = courseName;
        this.instructorName = instructName;
        this.departmentName = departmentName;
        this.lectureTime = lectureName;
    }
}
