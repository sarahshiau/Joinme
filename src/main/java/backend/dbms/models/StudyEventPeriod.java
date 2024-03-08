package backend.dbms.models;


import java.sql.Date;

import javax.validation.constraints.NotBlank;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@Entity
@Table(name = "study_event_period")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudyEventPeriod {

    

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NonNull
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="event_id")
    private StudyEvent event;

    @NonNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="classroom_id")
    private Classroom classroom;

    @NonNull
    @Column(name = "event_date")
    private Date eventDate;
    
    @NotBlank
    @Column(name = "event_period")
    private int eventPeriod;

    public StudyEventPeriod(StudyEvent event, Classroom classroom, Date evenDate, int period) {
        this.event = event;
        this.classroom = classroom;
        this.eventPeriod = period;
        this.eventDate = evenDate;
    }
}
