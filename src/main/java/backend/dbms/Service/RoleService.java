package backend.dbms.Service;

import java.util.Optional;

import backend.dbms.models.ERole;
import backend.dbms.models.Role;

public interface RoleService {
    Optional<Role> getByName(ERole role);
    
    void createRole(Role role);

    long count();
}
