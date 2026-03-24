package com.greeva.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/ui")
public class Ui {
    @GetMapping("/list-group")
public String listGroup() {
    return "ui/list-group";
}
    
@GetMapping("/carousel")
public String carousel() {
    return "ui/carousel";
}
    
@GetMapping("/placeholders")
public String placeholders() {
    return "ui/placeholders";
}
    
@GetMapping("/ratios")
public String ratios() {
    return "ui/ratios";
}
    
@GetMapping("/embed-video")
public String embedVideo() {
    return "ui/embed-video";
}
    
@GetMapping("/progress")
public String progress() {
    return "ui/progress";
}
    
@GetMapping("/grid")
public String grid() {
    return "ui/grid";
}
    
@GetMapping("/notifications")
public String notifications() {
    return "ui/notifications";
}
    
@GetMapping("/spinners")
public String spinners() {
    return "ui/spinners";
}
    
@GetMapping("/dropdowns")
public String dropdowns() {
    return "ui/dropdowns";
}
    
@GetMapping("/collapse")
public String collapse() {
    return "ui/collapse";
}
    
@GetMapping("/avatars")
public String avatars() {
    return "ui/avatars";
}
    
@GetMapping("/typography")
public String typography() {
    return "ui/typography";
}
    
@GetMapping("/breadcrumb")
public String breadcrumb() {
    return "ui/breadcrumb";
}
    
@GetMapping("/links")
public String links() {
    return "ui/links";
}
    
@GetMapping("/buttons")
public String buttons() {
    return "ui/buttons";
}
    
@GetMapping("/badges")
public String badges() {
    return "ui/badges";
}
    
@GetMapping("/tabs")
public String tabs() {
    return "ui/tabs";
}
    
@GetMapping("/offcanvas")
public String offcanvas() {
    return "ui/offcanvas";
}
    
@GetMapping("/pagination")
public String pagination() {
    return "ui/pagination";
}
    
@GetMapping("/utilities")
public String utilities() {
    return "ui/utilities";
}
    
@GetMapping("/accordions")
public String accordions() {
    return "ui/accordions";
}
    
@GetMapping("/cards")
public String cards() {
    return "ui/cards";
}
    
@GetMapping("/scrollspy")
public String scrollspy() {
    return "ui/scrollspy";
}
    
@GetMapping("/tooltips")
public String tooltips() {
    return "ui/tooltips";
}
    
@GetMapping("/modals")
public String modals() {
    return "ui/modals";
}
    
@GetMapping("/popovers")
public String popovers() {
    return "ui/popovers";
}
    
@GetMapping("/alerts")
public String alerts() {
    return "ui/alerts";
}
}
    