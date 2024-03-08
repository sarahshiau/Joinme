package backend.dbms.models;
import java.io.Serializable;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ParticipationId implements Serializable {
    private User user;
    private StudyEvent event;
}
