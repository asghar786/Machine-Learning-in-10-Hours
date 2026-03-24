package com.greeva.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/tables")
public class Tables {
    @GetMapping("/gridjs")
public String gridjs() {
    return "tables/gridjs";
}
    
@GetMapping("/datatable")
public String datatable() {
    return "tables/datatable";
}
    
@GetMapping("/basic")
public String basic() {
    return "tables/basic";
}
}
    