package com.example.backend.service;

import com.example.backend.models.User;
import com.example.backend.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;

@Service
public class ResetPasswordService {
    private  final UserRepository userRepository;
    private  final JavaMailSender mailSender;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final String SECRET_KEY = "0752f580d598d303d7b83415e46ccb5cde51caf113dfd3baae567d240abe0f3e";

    public ResetPasswordService(UserRepository userRepository, JavaMailSender mailSender, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.mailSender = mailSender;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }



    public  void sendPasswordResetEmail(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            String token = generateToken(user);
            String resetLink = "http://localhost:3000/resetpassword/token=" + token;
            sendEmail(user.getEmail(), resetLink);
        } else {
            throw new RuntimeException("User not found");
        }
    }

    private String generateToken(User user) {
        long expirationTime = 1000 * 60 *60; // 1 hour
        return Jwts.builder()
                .setSubject(user.getEmail())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    private void sendEmail(String to, String resetLink) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message);
            helper.setTo(to);
            helper.setSubject("Password Reset Request");
            helper.setText("Click the link to reset your password: " + resetLink, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }



    public void resetPassword(String token, String newPassword) {
        String email = jwtService.extractClaim(token, Claims::getSubject);
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        if (newPassword != null) {
            String encodedPassword = passwordEncoder.encode(newPassword);
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
        } else {
            throw new RuntimeException("Failed to reset password");
        }


    }
}
