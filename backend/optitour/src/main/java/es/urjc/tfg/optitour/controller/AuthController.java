package es.urjc.tfg.optitour.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import es.urjc.tfg.optitour.DTO.UserDTO;
import es.urjc.tfg.optitour.mapper.UserMapper;
import es.urjc.tfg.optitour.model.User;
import es.urjc.tfg.optitour.security.jwt.AuthResponse;
import es.urjc.tfg.optitour.security.jwt.LoginRequest;
import es.urjc.tfg.optitour.security.jwt.UserLoginService;
import es.urjc.tfg.optitour.service.UserService;
import es.urjc.tfg.optitour.security.jwt.AuthResponse.Status;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.security.Principal;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserLoginService userLoginService;

    private final UserService userService;

    private final UserMapper userMapper;

    public AuthController(UserLoginService userLoginService, UserService userService, UserMapper userMapper) {
        this.userLoginService = userLoginService;
        this.userService = userService;
        this.userMapper = userMapper;

    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        return userLoginService.login(response, loginRequest);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(
            @CookieValue(name = "RefreshToken", required = false) String refreshToken, HttpServletResponse response) {
        return userLoginService.refresh(response, refreshToken);
    }

    @PostMapping("/logout")
    public ResponseEntity<AuthResponse> logout(HttpServletResponse response) {
        return ResponseEntity.ok(new AuthResponse(Status.SUCCESS, userLoginService.logout(response)));
    }

    @GetMapping("/logged")
    public UserDTO getUserDTO(HttpServletRequest request) {

        Principal principal = request.getUserPrincipal();

        if (principal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                    "There's no user logged");
        }

        String userEmail = principal.getName();
        User user = userService.getUserByEmail(userEmail);

        return userMapper.toDTO(user);
    }

}
