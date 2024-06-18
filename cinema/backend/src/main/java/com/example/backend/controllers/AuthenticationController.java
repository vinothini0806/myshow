package com.example.backend.controllers;

import com.example.backend.dto.*;
import com.example.backend.models.AuthenticationRequest;
import com.example.backend.models.AuthenticationResponse;
import com.example.backend.models.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.AuthenticationService;
import com.example.backend.service.JwtService;
import com.example.backend.service.ResetPasswordService;
import com.example.backend.service.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService authenticationService;
    private final UserService userService;
    private final UserRepository userRepository;
    private final ResetPasswordService resetPasswordService;
    private final JwtService jwtService;


    @PostMapping("/verifyemail")
    public ResponseEntity<AuthenticationResponse> verifyEmailAndUsername(
            @RequestBody User request
    ) throws JsonProcessingException {

        return ResponseEntity.ok(authenticationService.verifyEmailAndUsername(request));
    }
    @PostMapping("/signup")
    public ResponseEntity<AuthenticationResponse> signup(
            @RequestBody User request
    ) {
        return ResponseEntity.ok(authenticationService.signup(request));


    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(
            @RequestBody AuthenticationRequest request
    ) {
        return ResponseEntity.ok(authenticationService.authenticate(request));
    }

//    http://localhost:8080/user/152
    @GetMapping("/user")
    public UserDTO getUserByUsername(@RequestHeader("Authorization") String token) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        String username = jwtService.extractClaim(token, Claims::getSubject);
        return userService.getUserByUsername(username);
    }

    @PutMapping("/updateuser")
    public User updateUser(
            @RequestBody UserUpdateRequestDTO userUpdateRequestDTO,
            @RequestHeader("Authorization") String token
    ){
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        String username = jwtService.extractClaim(token, Claims::getSubject);
        return userService.updateUserByUsername(username,userUpdateRequestDTO.getName(),userUpdateRequestDTO.getPhone(),userUpdateRequestDTO.getEmail(),userUpdateRequestDTO.getAddress());
    }


    @PostMapping("/forgotpassword")
    public ResponseEntity<String> forgotPassword(@RequestBody ResetPasswordRequestDTO resetPasswordRequestDTO){

        resetPasswordService.sendPasswordResetEmail(resetPasswordRequestDTO.getEmail());
        return ResponseEntity.ok("Password reset link sent to your email.");
    }

    @PostMapping("/resetpassword")
    public  ResponseEntity<String>  resetPassword(@RequestBody  ResetPasswordResponseDTO resetPasswordresponseDTO){
        resetPasswordService.resetPassword(resetPasswordresponseDTO.getToken(),resetPasswordresponseDTO.getNewPassword());
        return ResponseEntity.ok("Password reset successfully.");
    }



}
