package com.greeva.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/apps")
public class Apps {
    @GetMapping("/invoices")
public String invoices() {
    return "apps/invoices";
}
    
@GetMapping("/invoice-details")
public String invoiceDetails() {
    return "apps/invoice-details";
}
    
@GetMapping("/file-manager")
public String fileManager() {
    return "apps/file-manager";
}
    
@GetMapping("/email")
public String email() {
    return "apps/email";
}
    
@GetMapping("/invoice-create")
public String invoiceCreate() {
    return "apps/invoice-create";
}
    
@GetMapping("/calendar")
public String calendar() {
    return "apps/calendar";
}
}
    