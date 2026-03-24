package com.greeva.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/auth")
public class Auth {
    @GetMapping("/confirm-mail")
public String confirmMail() {
    return "auth/confirm-mail";
}
    
@GetMapping("/lock-screen")
public String lockScreen() {
    return "auth/lock-screen";
}
    
@GetMapping("/login")
public String login() {
    return "auth/login";
}
    
@GetMapping("/login-pin")
public String loginPin() {
    return "auth/login-pin";
}
    
@GetMapping("/register")
public String register() {
    return "auth/register";
}
    
@GetMapping("/createpw")
public String createpw() {
    return "auth/createpw";
}
    
@GetMapping("/recoverpw")
public String recoverpw() {
    return "auth/recoverpw";
}
    
@GetMapping("/logout")
public String logout() {
    return "auth/logout";
}
}
    