package com.selectmyflight.controller;

import com.selectmyflight.service.AiChatbotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiChatbotController {

    @Autowired
    private AiChatbotService aiChatbotService;

    public static class ChatRequest {
        private String query;
        public ChatRequest() {}
        public ChatRequest(String query) { this.query = query; }
        public String getQuery() { return query; }
        public void setQuery(String query) { this.query = query; }
    }

    // Feature 3: AI Travel Chatbot endpoint
    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> chatWithAi(@RequestBody(required = false) ChatRequest request) {
        String query = (request != null && request.getQuery() != null) ? request.getQuery() : "help";
        return ResponseEntity.ok(aiChatbotService.processQuery(query));
    }
}
