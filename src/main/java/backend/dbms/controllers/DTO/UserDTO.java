package backend.dbms.controllers.DTO;

public interface UserDTO {
    Long getUserId();
    String getUserName();
    String getEmail();
    int getTotalHold();
    int getTotalParticipation();
}
