package backend.dbms;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.sql.Date;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Random;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import backend.dbms.Service.Pair;
import backend.dbms.Service.Impl.ClassroomImpl;
import backend.dbms.Service.Impl.CourseImpl;
import backend.dbms.Service.Impl.ParticipationImpl;
import backend.dbms.Service.Impl.RoleImpl;
import backend.dbms.Service.Impl.StudyEventImpl;
import backend.dbms.Service.Impl.StudyEventPeriodImpl;
import backend.dbms.Service.Impl.UserImpl;
import backend.dbms.models.Classroom;
import backend.dbms.models.Course;
import backend.dbms.models.ERole;
import backend.dbms.models.StudyEvent;
import backend.dbms.models.StudyEventPeriod;
import backend.dbms.models.Participation;
// import backend.dbms.models.ParticipantId;
import backend.dbms.models.Role;
import backend.dbms.models.Status;
import backend.dbms.models.User;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private StudyEventImpl eventImpl;

    @Autowired
    private CourseImpl courseImpl;

    @Autowired
    private StudyEventPeriodImpl eventPeriodImpl;

    @Autowired
    private UserImpl userImpl;

    @Autowired
    private RoleImpl roleImpl;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private ParticipationImpl ParticipantionImpl;

    @Autowired
    private ClassroomImpl classroomImpl;

    @Autowired
    private ParticipationImpl participationImpl;

    @Override
    public void run(String... args) throws Exception {
        if (roleImpl.count() == 0) {
            roleImpl.createRole(new Role(ERole.ROLE_USER));
            roleImpl.createRole(new Role(ERole.ROLE_MODERATOR));
            roleImpl.createRole(new Role(ERole.ROLE_ADMIN));
            roleImpl.createRole(new Role(ERole.ROLE_PROVIDER));
    }
        
        Random r = new Random();
        if (userImpl.count() == 0) {
            for(int i=0; i<=3000; i++){
                String name = Integer.toString(r.nextInt(999999-100000+1)+100000);
                if(!userImpl.existsByUsername(name)){
                    User user = new User(name, name+"@gmail.com", encoder.encode(name));
                    Role modRole = roleImpl.getByName(ERole.ROLE_ADMIN)
                                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                    Set<Role> role1 = new HashSet<>();
                    role1.add(modRole);
                    user.setRoles(role1);
                    userImpl.createUser(user);
                }
                
                
            }           
        }
        // User user = userImpl.getByUsername("111111").get();
        // List<StudyEvent> events = eventImpl.getByHolder(user);
        // List<User> userList = userImpl.getAllUsers();
        // for(User part : userList){
        //     int id = r.nextInt(events.size())+300000;
        //     Participation p = new Participation(part, events.get(id), new Date(new java.util.Date().getTime()));
        //     participationImpl.createParticipation(p);
        // }
        // createALot();
        // findBookedTime();
        // findBookedClassroom();
    }
    public void createALot(){
        List<User> userList = userImpl.getAllUsers();
        for(User user : userList){
            try {
                autoGenerateEvent(user);
            } catch (ParseException e) {
                continue;
            }
        }
    }
    public void autoGenerateEvent (User user) throws ParseException{
        long courseCount = courseImpl.count();
        long classroomCount = classroomImpl.count();
        Random r = new Random();
        DateFormat df = new SimpleDateFormat("yyyy/MM/dd");
        Date today = new Date(new java.util.Date().getTime());
        for(int j=0; j<100; j++){
                    long courseId = r.nextLong(courseCount);
                    try{
                        Course course = courseImpl.getByCourseId(courseId).get();
                        int day = r.nextInt(30)+3;
                        Date eventDate = new Date(today.getTime() + 1000 * 60 * 60 * 24 *day);
                        List<Integer> periodList = new ArrayList<Integer>();
                        int periodLen = r.nextInt(3);
                        int period = r.nextInt(13)+8;
                        for(int p=0; p<=periodLen; p++){
                            periodList.add(period+p);
                        }
                        long classroomId = r.nextLong(classroomCount)+1;;
                        Classroom classroom = classroomImpl.getByClassroomId(classroomId)
                                .orElseThrow(() -> new RuntimeException("Error: Classroom is not found."));
                        if(eventPeriodImpl.checkTimeAvailable(classroom,eventDate,periodList)){
                            // StudyEvent studyEvent = new StudyEvent(user, course, classroom,eventDate, "", Status.Ongoing);
                            StudyEvent studyEvent = new StudyEvent(user, course, "", Status.Ongoing);
                            eventImpl.createEvent(studyEvent);
                            for(int p=0; p<=periodLen; p++){
                                // StudyEventPeriod eventPeriod = new StudyEventPeriod(studyEvent, period+p);
                                StudyEventPeriod eventPeriod = new StudyEventPeriod(studyEvent, classroom, eventDate, period+p);
                                eventPeriodImpl.createEventPeriod(eventPeriod);
                            }
                        }
                    }
                    catch(Exception e){

                    }
                    
                    
                }
    }
    public void findBookedTime() throws ParseException{
        Classroom classroom = classroomImpl.getByClassroomId(Long.valueOf(1))
                            .orElseThrow(() -> new RuntimeException("Error: Classroom is not found."));
        DateFormat df = new SimpleDateFormat("yyyy/MM/dd");
        Date today = new Date(df.parse("2023/10/15").getTime());
        
        int[][] periodList = eventPeriodImpl.findBookedTime(classroom,today);
        for (int i =0;i<periodList.length;i++) {
            System.err.println("10/"+(15+i));
            for (int j = 0; j<periodList[i].length; j++){
                System.err.println(j+":"+ periodList[i][j]);
            }
        }
    }
    public void findBookedClassroom() throws ParseException{
        DateFormat df = new SimpleDateFormat("yyyy/MM/dd");
        Date today = new Date(df.parse("2023/10/17").getTime());
        List<Pair> pairs =  classroomImpl.findBookedClassroom(today);
        for(int i = 0; i<5;i++){
            System.out.println(pairs.get(i));
        }
    }
    

}
