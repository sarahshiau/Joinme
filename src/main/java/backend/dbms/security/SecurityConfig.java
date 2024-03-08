package backend.dbms.security;

import org.apache.catalina.authenticator.SpnegoAuthenticator.AuthenticateAction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.client.HttpClientErrorException.Unauthorized;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import backend.dbms.security.jwt.AuthTokenFilter;
import backend.dbms.security.services.UserDetailsServiceImpl;

// @EnableWebSecurity
@Configuration
public class SecurityConfig {
  @Autowired
  UserDetailsServiceImpl userDetailsService;




  @Bean
  public AuthTokenFilter authenticationJwtTokenFilter() {
    return new AuthTokenFilter();
  }

  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
    return authenticationConfiguration.getAuthenticationManager();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  // @Bean
  // protected CorsConfigurationSource corsConfigurationSource() {
  //   final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
  //   CorsConfiguration config = new CorsConfiguration();
  //   config.addAllowedHeader("*");
  //   config.addAllowedMethod("*");
  //   config.addAllowedOrigin("http://localhost:3000");
  //   source.registerCorsConfiguration("/**", config);
  //   return source;
  // }

  @Bean
  protected SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
  
    http
    .cors(Customizer.withDefaults())
    .exceptionHandling((exceptionHandling) ->
        exceptionHandling.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))
    .sessionManagement((session) -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
    .addFilterBefore(authenticationJwtTokenFilter(), BasicAuthenticationFilter.class)
    .authorizeHttpRequests((auth) -> auth
      .requestMatchers("/api/auth/**").permitAll()
      .requestMatchers("/api/test/**").permitAll()
      .anyRequest().authenticated()
      ).csrf(csrf -> csrf.disable());
    // .requestMatchers("/api/**").hasRole("USER"));
    // .authorizeHttpRequests(auth -> auth.requestMatchers("/api/**").permitAll()
    // .anyRequest().authenticated());

  return http.build();
  }
  
  // @Bean
  //   public WebMvcConfigurer corsConfigurer() {
  //       return new WebMvcConfigurer() {
  //           @Override
  //           public void addCorsMappings(CorsRegistry registry) {
  //               registry.addMapping("/**")
  //                       .allowedMethods("HEAD", "GET", "PUT", "POST", "DELETE", "PATCH");
  //           }
  //       };
  //   }
}


// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.authentication.AuthenticationManager;
// import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
// import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
// import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
// import org.springframework.security.config.http.SessionCreationPolicy;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

// import exchange_rate.backend.security.jwt.AuthEntryPointJwt;
// import exchange_rate.backend.security.jwt.AuthTokenFilter;
// import exchange_rate.backend.security.services.UserDetailsServiceImpl;

// @Configuration
// @EnableWebSecurity
// @EnableGlobalMethodSecurity(
//     // securedEnabled = true,
//     // jsr250Enabled = true,
//     prePostEnabled = true)
// public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
//   @Autowired
//   UserDetailsServiceImpl userDetailsService;

//   @Autowired
//   private AuthEntryPointJwt unauthorizedHandler;

//   @Bean
//   public AuthTokenFilter authenticationJwtTokenFilter() {
//     return new AuthTokenFilter();
//   }

//   @Override
//   public void configure(AuthenticationManagerBuilder authenticationManagerBuilder) throws Exception {
//     authenticationManagerBuilder.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
//   }

//   @Bean
//   @Override
//   public AuthenticationManager authenticationManagerBean() throws Exception {
//     return super.authenticationManagerBean();
//   }

//   @Bean
//   public PasswordEncoder passwordEncoder() {
//     return new BCryptPasswordEncoder();
//   }

//   @Override
//   protected void configure(HttpSecurity http) throws Exception {
//     http.cors().and().csrf().disable()
//       .exceptionHandling().authenticationEntryPoint(unauthorizedHandler).and()
//       .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
//       .authorizeRequests().antMatchers("/api/auth/**").permitAll()
//       .antMatchers("/api/test/**").permitAll()
//       .anyRequest().authenticated();

//     http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
//   }
// }
