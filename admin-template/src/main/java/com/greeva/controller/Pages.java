package com.greeva.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/pages")
public class Pages {
    @GetMapping("/maintenance")
public String maintenance() {
    return "pages/maintenance";
}
    
@GetMapping("/terms-conditions")
public String termsConditions() {
    return "pages/terms-conditions";
}
    
@GetMapping("/starter")
public String starter() {
    return "pages/starter";
}
    
@GetMapping("/faq")
public String faq() {
    return "pages/faq";
}
    
@GetMapping("/timeline")
public String timeline() {
    return "pages/timeline";
}
    
@GetMapping("/pricing")
public String pricing() {
    return "pages/pricing";
}
    
@GetMapping("/coming-soon")
public String comingSoon() {
    return "pages/coming-soon";
}
}
    