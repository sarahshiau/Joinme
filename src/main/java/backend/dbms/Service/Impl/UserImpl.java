package backend.dbms.Service.Impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import backend.dbms.Service.UserService;
import backend.dbms.controllers.DTO.UserDTO;
import backend.dbms.models.User;
import backend.dbms.repository.UserDao;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Service
public class UserImpl implements UserService{

    @Autowired
    private UserDao userDao;

    @Override
    public Optional<User> getByUsername(String username){
        return userDao.findByUsername(username);
    }

    @Override
    public Boolean existsByUsername(String username){
        return userDao.existsByUsername(username);
    }

    @Override
    public Boolean existsByEmail(String email){
        return userDao.existsByEmail(email);
    }

    @Override
    public void createUser(User user){
        userDao.save(user);
    }

    @Override
    public long count(){
        return userDao.count();
    }

    @Override
    public List<User> getAllUsers(){
        return userDao.findAll();
    }

    @Override
    public  Page<UserDTO> searchUser(Long userId, String userName, String email,  int page, int row){
        Pageable pageable = PageRequest.of(page,row, Sort.by("id"));
        return userDao.findByMultiCon(userId, userName, email, pageable);
    }
}
