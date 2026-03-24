package com.greeva.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/maps")
public class Maps {
    @GetMapping("/vector")
public String vector() {
    return "maps/vector";
}
    
@GetMapping("/leaflet")
public String leaflet() {
    return "maps/leaflet";
}
    
@GetMapping("/google")
public String google() {
    return "maps/google";
}
}
    