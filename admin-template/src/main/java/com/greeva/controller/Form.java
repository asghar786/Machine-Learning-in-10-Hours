package com.greeva.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/form")
public class Form {
    @GetMapping("/elements")
public String elements() {
    return "form/elements";
}
    
@GetMapping("/fileuploads")
public String fileuploads() {
    return "form/fileuploads";
}
    
@GetMapping("/select")
public String select() {
    return "form/select";
}
    
@GetMapping("/range-slider")
public String rangeSlider() {
    return "form/range-slider";
}
    
@GetMapping("/layouts")
public String layouts() {
    return "form/layouts";
}
    
@GetMapping("/inputmask")
public String inputmask() {
    return "form/inputmask";
}
    
@GetMapping("/wizard")
public String wizard() {
    return "form/wizard";
}
    
@GetMapping("/picker")
public String picker() {
    return "form/picker";
}
    
@GetMapping("/editors")
public String editors() {
    return "form/editors";
}
    
@GetMapping("/validation")
public String validation() {
    return "form/validation";
}
}
    