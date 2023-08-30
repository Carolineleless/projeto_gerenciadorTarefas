package br.edu.ifsp.abc_tech.service;

import br.edu.ifsp.abc_tech.model.User;
import br.edu.ifsp.abc_tech.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public void registerUser(User user) {
        userRepository.save(user);
    }

    public User signIn(String username, String password) {
        User user = userRepository.findByUsername(username);
        if(user != null && user.getPassword().equals(password)) {
            return user;
        }
        return null;
    }

}
