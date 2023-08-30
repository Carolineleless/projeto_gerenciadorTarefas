package br.edu.ifsp.abc_tech.controller;

import br.edu.ifsp.abc_tech.model.User;
import br.edu.ifsp.abc_tech.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class LoginController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public String login(@RequestParam String username, @RequestParam String password, HttpSession session) {
        User user = userService.signIn(username, password);
        if(user != null) {
            session.setAttribute("usuarioLogado", user);
            return "redirect:pagina-inicial";
        }
        return "redirect:/login?error=true";
    }

    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }

}
