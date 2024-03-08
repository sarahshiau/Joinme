package backend.dbms.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;

import backend.dbms.controllers.DTO.UserDTO;
import backend.dbms.models.User;

public interface UserService {
    Optional<User> getByUsername(String username);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);

    void createUser(User user);

    long count();

    List<User> getAllUsers();

    Page<UserDTO> searchUser(Long userId, String userName, String email,  int page, int row);
}
