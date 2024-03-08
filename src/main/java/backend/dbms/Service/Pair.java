package backend.dbms.Service;

import org.springframework.stereotype.Component;

import backend.dbms.models.Classroom;
import lombok.AllArgsConstructor;
import lombok.Data;

@Component
@Data
@AllArgsConstructor
public class Pair {
    private Classroom classroom;
    private int[] periodList;
}
