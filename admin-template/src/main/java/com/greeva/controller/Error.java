package com.greeva.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/error")
public class Error {
    @GetMapping("/403")
public String Error403() {
    return "error/403";
}
    
@GetMapping("/404-alt")
public String Error404Alt() {
    return "error/404-alt";
}
    
@GetMapping("/401")
public String Error401() {
    return "error/401";
}
    
@GetMapping("/500")
public String Error500() {
    return "error/500";
}
    
@GetMapping("/service-unavailable")
public String serviceUnavailable() {
    return "error/service-unavailable";
}
    
@GetMapping("/400")
public String Error400() {
    return "error/400";
}
    
@GetMapping("/404")
public String Error404() {
    return "error/404";
}
}
    