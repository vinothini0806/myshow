package com.example.backend.service;

import com.example.backend.dto.AuthenticationResponseDTO;
import com.example.backend.dto.UserRequestDTO;
import com.example.backend.model.Role;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AuthenticationService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final ModelMapper modelMapper;

    public AuthenticationService(UserRepository repository, PasswordEncoder passwordEncoder, JwtService jwtService, AuthenticationManager authenticationManager, ModelMapper modelMapper) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.modelMapper = modelMapper;
    }


    public AuthenticationResponseDTO register(UserRequestDTO userRequestDTO) {

        // check if user already exist. if exist than authenticate the user
        if(repository.findByEmail(userRequestDTO.getEmail()).isPresent()) {
            return new AuthenticationResponseDTO(null, "User already exist");
        }

        User user = modelMapper.map(userRequestDTO, User.class);

        user.setUsername(user.getUsername());
        user.setEmail(user.getEmail());
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        //user.setRole(request.getRole());
        //since this is only for one user -->put role as USER in default

        user.setRole(Role.USER);
        user = repository.save(user);

        //here generating token at the registration in not needed.created token and pass it to the FE.
        //In FE it checks if there is a token return then it take registration is success and redirect to the login page
        String jwt = jwtService.generateToken(user);

        return new AuthenticationResponseDTO(jwt,"User registered successfully");

    }


    public AuthenticationResponseDTO authenticate(UserRequestDTO userRequestDTO) {
        try {
            System.out.println("Attempting to authenticate user: " + userRequestDTO.getEmail());

            User user = modelMapper.map(userRequestDTO, User.class);
            // Authenticate the user
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            user.getEmail(),
                            user.getPassword()
                    )
            );

            System.out.println("Authentication successful for user: " + user.getUsername());

            // Find the user from the repository
            User authenticatedUser = repository.findByEmail(user.getEmail()).orElseThrow();
            System.out.println(authenticatedUser);

            // Generate JWT token
            String token = jwtService.generateToken(authenticatedUser);
            return new AuthenticationResponseDTO(token,"User authenticated successfully");
        } catch (BadCredentialsException e) {
            System.err.println("Invalid username or password for user: " + userRequestDTO.getEmail());
            e.printStackTrace();
            throw new RuntimeException("Invalid username or password", e);
        } catch (Exception e) {
            System.err.println("An error occurred during authentication for user: " + userRequestDTO.getEmail());
            e.printStackTrace();
            throw new RuntimeException("An error occurred during authentication", e);
        }
    }


}
