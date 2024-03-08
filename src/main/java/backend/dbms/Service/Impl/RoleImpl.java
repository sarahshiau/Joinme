package backend.dbms.Service.Impl;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import backend.dbms.Service.RoleService;
import backend.dbms.models.ERole;
import backend.dbms.models.Role;
import backend.dbms.repository.RoleDao;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Service
public class RoleImpl implements RoleService {
    
    @Autowired
    private RoleDao roleDao;

    @Override
    public Optional<Role> getByName(ERole name){
        return roleDao.findByName(name);
    }

    @Override
    public void createRole(Role role){
        roleDao.save(role);
    }

    @Override
    public long count(){
        return roleDao.count();
    }
}
