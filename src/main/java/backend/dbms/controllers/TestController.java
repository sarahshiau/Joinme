package backend.dbms.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import backend.dbms.Service.Impl.StudyEventImpl;
import backend.dbms.Service.Impl.UserImpl;
import backend.dbms.controllers.Request.StudyEventReq;
import backend.dbms.models.User;
import backend.dbms.repository.UserDao;
import backend.dbms.security.jwt.JwtUtils;
import lombok.extern.slf4j.Slf4j;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/test")
@Slf4j
public class TestController {
  @Autowired
  private UserDao userRepository;
  @Autowired
  private JwtUtils jwtUtils;
  @Autowired
  private StudyEventImpl eventImpl;
  @GetMapping("/all")
  public String allAccess() {
    return "Public Content.";
  }

  @GetMapping("/user")
  @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
  public String userAccess() {
    return "User Content.";
  }

  @GetMapping("/mod")
  @PreAuthorize("hasRole('MODERATOR')")
  public String moderatorAccess() {
    return "Moderator Board.";
  }

  @GetMapping("/admin")
  @PreAuthorize("hasRole('ADMIN')")
  public String adminAccess() {
    return "Admin Board.";
  }
  // 測試併行控制是否有成功上鎖
  @PreAuthorize("hasRole('PROVIDER')")
  @PostMapping("/concurrency")
  public String testConcurrency(@RequestHeader("Authorization") String token,@RequestBody List<StudyEventReq> event) throws InterruptedException, ExecutionException {
      String userName = jwtUtils.getUserNameFromJwtToken(token.substring(7, token.length()));
      User user = userRepository.findByUsername(userName).get();
      // 開啟兩個執行緒同步新增讀書活動
      ExecutorService executor = Executors.newFixedThreadPool(2);
      // executor.execute(()->eventImpl.createEvent(event.get(0),user));
      // executor.execute(()->eventImpl.createEvent(event.get(1),user));
      String result1 = executor.submit(()->eventImpl.createEvent(event.get(0),user)).get();
      String result2 = executor.submit(()->eventImpl.createEvent(event.get(1),user)).get();
      executor.shutdown();
      System.err.println(result2);
      // 等待三秒後再新增一筆讀書活動，確認 study_event_period 是否有解鎖
      String result3 = eventImpl.createEvent(event.get(2),user);
      return result1+"\n"+result2+"\n"+result3;
  }
  @GetMapping("/logCatch/{msg}")
    public String logCatch(@PathVariable(value = "msg") String msg) {
        //打印因为SLF4J就这5个级别
        //日志格式具体可以自己调："%d{HH:mm:ss.SSS} [%t] %-5level %logger{36} - %msg%n"
        log.error(" 錯誤訊息，不會影響系統運行");
        log.warn(" 警告訊息，可能會發生系統問題");
        log.info(" 運作訊息"); //当前我们的log4j2.xml设置的级别
        log.debug(" 調適訊息，一般在開發中使用，記錄程式變量等等"); //SLF4J默认级别
        log.trace(" 追踪訊息，記錄程序所有的流程訊息");
        log.info("打印請求的訊息:{}", msg);
        return "请求成功！！";
    }
}
