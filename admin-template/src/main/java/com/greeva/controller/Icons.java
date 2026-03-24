package com.greeva.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/icons")
public class Icons {
    @GetMapping("/tabler")
public String tabler() {
    return "icons/tabler";
}
    
@GetMapping("/solar")
public String solar() {
    return "icons/solar";
}
}
    