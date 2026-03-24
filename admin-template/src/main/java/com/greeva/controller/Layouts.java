package com.greeva.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/layouts")
public class Layouts {
    @GetMapping("/compact")
public String compact() {
    return "layouts-eg/compact";
}
    
@GetMapping("/detached")
public String detached() {
    return "layouts-eg/detached";
}
    
@GetMapping("/full")
public String full() {
    return "layouts-eg/full";
}

@GetMapping("/fullscreen")
public String fullscreen() {
    return "layouts-eg/fullscreen";
}

@GetMapping("/horizontal")
public String horizontal() {
    return "layouts-eg/horizontal";
}

@GetMapping("/hover")
public String hover() {
    return "layouts-eg/hover";
}

@GetMapping("/icon-view")
public String iconView() {
    return "layouts-eg/icon-view";
}
}
    