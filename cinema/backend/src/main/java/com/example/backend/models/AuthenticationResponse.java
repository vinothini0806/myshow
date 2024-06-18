package com.example.backend.models;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor

@Data

public class AuthenticationResponse {
    private String token;
    private String message;


}
