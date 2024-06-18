package com.example.backend.service;

import com.example.backend.dto.KafkaCinemaDTO;
import com.example.backend.dto.KafkaShowDTO;
import com.example.backend.models.AuthenticationRequest;
import com.example.backend.models.AuthenticationResponse;
import com.example.backend.repository.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Encoders;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.backend.models.User;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Optional;


@RequiredArgsConstructor
@Service
public class AuthenticationService {


    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    private final KafkaService kafkaService;

    private final AuthenticationManager authenticationManager;

    private  final JavaMailSender mailSender;

    private final String SECRET_KEY = "0752f580d598d303d7b83415e46ccb5cde51caf113dfd3baae567d240abe0f3e";


    public AuthenticationResponse verifyEmailAndUsername(User request) throws JsonProcessingException {
        if(userRepository.findByUsername(request.getUsername()).isPresent() && userRepository.findByEmail(request.getEmail()).isPresent()) {
            return new AuthenticationResponse(null,"User with this username and email already exist");
        }
        if(userRepository.findByEmail(request.getEmail()).isPresent()) {
            return new AuthenticationResponse(null,"User with this email already exist");
        }
        if(userRepository.findByUsername(request.getUsername()).isPresent()) {
            return new AuthenticationResponse(null,"User with this username already exist");
        }
        boolean emailSent = sendVerificationEmail(request);
        if (emailSent) {
            return new AuthenticationResponse(request.getEmail(), "Email verification successful");
        } else {
            return new AuthenticationResponse(null, "Failed to send verification email");
        }
    }

    public AuthenticationResponse signup(User request) {


        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setAddress(request.getAddress());
        user.setPhone(request.getPhone());
        user.setUsername(request.getUsername());
        user.setRole(request.getRole());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        user = userRepository.save(user);
        if(user != null) {
            KafkaCinemaDTO kafkaCinemaDTO = new KafkaCinemaDTO();
            kafkaCinemaDTO.setId(user.getId());
            kafkaCinemaDTO.setName(user.getUsername());
            kafkaService.processCinema(kafkaCinemaDTO);
        }
        String token = jwtService.generateToken(user);

        return new AuthenticationResponse(token,"User registered successfully");
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()));
        User user = userRepository.findByUsername(request.getUsername()).orElseThrow();
        String token = jwtService.generateToken(user);

        return new AuthenticationResponse(token,"User authenticated successfully");

    }



    public boolean sendVerificationEmail(User user) throws JsonProcessingException {
        String token = generateToken(user);
        String verificationLink = "http://localhost:3000/verify/token=" + token;
        return sendEmail(user.getEmail(), verificationLink) ;

    }

    private String generateToken(User user) throws JsonProcessingException {
        long expirationTime = 1000 * 60 *2; // 1 hour


        ObjectMapper objectMapper = new ObjectMapper(); // or use an existing one
        String json = objectMapper.writeValueAsString(user);
        byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
        String base64 = Encoders.BASE64.encode(bytes);

        return Jwts.builder()
                .setSubject(user.getUsername())
                .claim("userJsonBase64", base64)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    public boolean sendEmail(String email, String verificationLink) {
        try {

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(email);
            helper.setSubject("Email Verification");
            helper.setText("Click the link to verify your email: " + verificationLink, true);

            mailSender.send(message);
            return true;
        } catch (Exception e) {

            return false;
        }
    }




}
