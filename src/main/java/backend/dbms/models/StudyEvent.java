package backend.dbms.models;

import java.sql.Date;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.Setter;


@NoArgsConstructor
@AllArgsConstructor
@RequiredArgsConstructor
@Getter
@Setter
@Entity
@Data
@Table(name = "study_event")
public class StudyEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_id")
    private Long eventId;
    
    @NonNull
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id")
    private User holder;

    @NonNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="course_id")
    private Course course;

    // @NonNull
    // @ManyToOne
    // @JoinColumn(name="classroom_id")
    // private Classroom classroom;

    @OneToMany(mappedBy = "event", cascade = CascadeType.PERSIST)
    private List<StudyEventPeriod> eventPeriods;

    // @NonNull
    // @Column(name = "event_date")
    // private Date eventDate;

    @NotBlank
    @Column(name = "user_max")
    private int userMax;

    @Size(max = 100)
    @NonNull
    private String content;

    @NonNull
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Status status;
    

    public String getUserName(){
        return holder.getUsername();
    }
    // public void addParticipant(Participant participant){
    //     participantList.add(participant);
    // }
    public StudyEvent(User holder, Course course, int userMax, String content, Status status){
        this.holder = holder;
        this.course = course;
        this.userMax = userMax;
        this.content = content;
        this.status = status;
    }
}
