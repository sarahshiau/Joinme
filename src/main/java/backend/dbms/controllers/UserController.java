package backend.dbms.controllers;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import backend.dbms.Service.Impl.UserImpl;
import backend.dbms.controllers.DTO.UserDTO;
import backend.dbms.models.Course;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {
    @Autowired
    private UserImpl userImpl;
    @GetMapping("/admin/users")
    public Page<UserDTO> search(@RequestParam int page, @RequestParam int row,@RequestParam(required = false) Long userId, @RequestParam(required = false) String userName, @RequestParam(required = false) String email) throws UnsupportedEncodingException{
        if(userName!=null){
            userName = URLDecoder.decode(userName, "UTF-8");
        }
        if(email!=null){
            email = URLDecoder.decode(email, "UTF-8");
        }
        return userImpl.searchUser(userId, userName, email, page-1, row);
    }
}
