package backend.dbms.models;

import javax.validation.constraints.NotBlank;

import org.springframework.stereotype.Component;

import jakarta.annotation.Nullable;
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
@Table(name = "classroom")
@Component
public class Classroom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "classroom_id")
    private Long classroomId;

    @NonNull
    @Column(name = "building_name", length = 30)
    private String buildingName;

    @Column(name = "floor_number")
    private Integer floorNumber;

    @NotBlank
    @Column(name = "room_name", length = 20)
    private String roomName;
    
    @NotBlank
    @Column(name = "capacity_size")
    private int capacitySize;
    
}
