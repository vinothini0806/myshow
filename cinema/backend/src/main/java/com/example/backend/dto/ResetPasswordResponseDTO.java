package com.example.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResetPasswordResponseDTO {

    private String token;
    private String newPassword;
}
