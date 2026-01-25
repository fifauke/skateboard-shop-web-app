package com.pw.essask8.dto;

import lombok.*;

@Data
@Builder  
@AllArgsConstructor
@NoArgsConstructor
public class LoginDto {

    private String username;
    
    private String password;
}