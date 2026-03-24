package com.greeva.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/extended")
public class Extended {
    @GetMapping("/dragula")
public String dragula() {
    return "extended/dragula";
}
    
@GetMapping("/ratings")
public String ratings() {
    return "extended/ratings";
}
    
@GetMapping("/scrollbar")
public String scrollbar() {
    return "extended/scrollbar";
}
    
@GetMapping("/sweetalerts")
public String sweetalerts() {
    return "extended/sweetalerts";
}
}
    