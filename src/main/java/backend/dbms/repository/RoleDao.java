package backend.dbms.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import backend.dbms.models.ERole;
import backend.dbms.models.Role;

@Repository
public interface RoleDao extends JpaRepository<Role, Integer> {
  
  Optional<Role> findByName(ERole name);
}
