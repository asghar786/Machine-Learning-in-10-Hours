package com.greeva.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/charts")
public class Charts {
    @GetMapping("/apex-radar")
public String apexRadar() {
    return "charts/apex-radar";
}
    
@GetMapping("/apex-column")
public String apexColumn() {
    return "charts/apex-column";
}
    
@GetMapping("/apex-scatter")
public String apexScatter() {
    return "charts/apex-scatter";
}
    
@GetMapping("/apex-line")
public String apexLine() {
    return "charts/apex-line";
}
    
@GetMapping("/apex-bar")
public String apexBar() {
    return "charts/apex-bar";
}
    
@GetMapping("/apex-sparklines")
public String apexSparklines() {
    return "charts/apex-sparklines";
}
    
@GetMapping("/apex-timeline")
public String apexTimeline() {
    return "charts/apex-timeline";
}
    
@GetMapping("/apex-radialbar")
public String apexRadialbar() {
    return "charts/apex-radialbar";
}
    
@GetMapping("/apex-area")
public String apexArea() {
    return "charts/apex-area";
}
    
@GetMapping("/apex-bubble")
public String apexBubble() {
    return "charts/apex-bubble";
}
    
@GetMapping("/apex-mixed")
public String apexMixed() {
    return "charts/apex-mixed";
}
    
@GetMapping("/apex-pie")
public String apexPie() {
    return "charts/apex-pie";
}
    
@GetMapping("/apex-treemap")
public String apexTreemap() {
    return "charts/apex-treemap";
}
    
@GetMapping("/apex-candlestick")
public String apexCandlestick() {
    return "charts/apex-candlestick";
}
    
@GetMapping("/apex-boxplot")
public String apexBoxplot() {
    return "charts/apex-boxplot";
}
    
@GetMapping("/apex-polar-area")
public String apexPolarArea() {
    return "charts/apex-polar-area";
}
    
@GetMapping("/apex-heatmap")
public String apexHeatmap() {
    return "charts/apex-heatmap";
}
}
    