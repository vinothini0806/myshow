package com.example.backend.service;

import com.example.backend.dto.UserDTO;

import com.example.backend.models.User;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;


import org.springframework.stereotype.Service;

import java.util.Optional;



@RequiredArgsConstructor
@Service
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;


    public UserDTO getUserByUsername(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        return new UserDTO(
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getAddress()

        );
    }


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
                .orElseThrow(()-> new UsernameNotFoundException("User not found"));

    }



    public User updateUserByUsername(String username, String name, String phone, String email, String address)  {
        try {
            Optional<User> user = userRepository.findByUsername(username);

            if (user.isEmpty()){
                throw new Exception("User not found");
            }

            User userdata = user.get();

            if (name != null){
                userdata.setName(name);
            }

            if (email != null){
                userdata.setEmail(email);
            }

            if (address != null){
                userdata.setAddress(address);
            }

            if (phone != null){
                userdata.setPhone(phone);
            }


            userRepository.save(userdata);

            return userdata;

        }catch (Exception e){
            System.out.println(e.getMessage());
            return null;
        }

    }





    }


