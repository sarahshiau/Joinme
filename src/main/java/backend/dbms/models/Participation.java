package backend.dbms.models;

import java.util.Date;

import io.micrometer.common.lang.NonNull;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@Entity
@Table(name = "participation")
@AllArgsConstructor
@RequiredArgsConstructor
@Data
@IdClass(ParticipationId.class)
public class Participation {
     
    

    // @Id
    // @GeneratedValue(strategy = GenerationType.IDENTITY)
    // private Long id;

    

    // @ManyToOne(cascade = {CascadeType.PERSIST,CascadeType.MERGE})
    @PrimaryKeyJoinColumn(name = "user_id")
    @ManyToOne(fetch = FetchType.LAZY)
    @Id
    @NonNull
    private User user;
    
    // @ManyToOne(cascade = {CascadeType.PERSIST,CascadeType.MERGE})
    @PrimaryKeyJoinColumn(name = "event_id")
    @ManyToOne(fetch = FetchType.LAZY)
    @Id
    @NonNull
    private StudyEvent event;
    
    @NonNull
    @Column(name = "join_time")
    private Date joinTime;

    // private String feedback;

    // public Participation(User user, StudyEvent event, Date joinTime) {
    //     this.user = user;
    //     this.event  = event;
    //     this.joinTime = joinTime;
    // }
    public StudyEvent getEvent(){
        return event;
    }
}
