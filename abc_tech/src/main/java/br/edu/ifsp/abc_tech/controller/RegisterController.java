package br.edu.ifsp.abc_tech.controller;

import br.edu.ifsp.abc_tech.model.User;
import br.edu.ifsp.abc_tech.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class RegisterController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public String register(@RequestParam String username, @RequestParam String password) {
        User user = new User();
        user.setUsername(username);
        user.setPassword(password);
        userService.registerUser(user);
        return "redirect:/login";
    }

    @GetMapping("/register")
    public String registerPage() {
        return "/register";
    }

}
