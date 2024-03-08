package backend.dbms.controllers.Response;

import java.util.List;

import backend.dbms.controllers.DTO.StudyEventDTO;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EventResponse {
    private List<StudyEventDTO> eventDTO;
    private int totalPage;
}
