package com.example.FloraX.Service.Impl;

import com.example.FloraX.Config.JwtService;
import com.example.FloraX.Dto.Auth.*;
import com.example.FloraX.Entity.Users;
import com.example.FloraX.Enum.UserRole;
import com.example.FloraX.Repository.UserRepository;
import com.example.FloraX.Service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    // In-memory token storage for demo purposes
    private final static java.util.Map<String, String> resetTokens = new java.util.HashMap<>();

    @Override
    public AuthResponse register(RegisterRequest request) {
        Users user = new Users();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setRole(UserRole.USER);
        user.setCreatedAt(LocalDateTime.now());
        userRepository.save(user);

        String token = jwtService.generateToken(user.getEmail());
        return new AuthResponse(token);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        Users user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        String token = jwtService.generateToken(user.getEmail());
        return new AuthResponse(token);
    }

    @Override
    public void forgetPassword(ForgetPasswordRequest request) {
        Users user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Generate a reset token (UUID)
        String token = UUID.randomUUID().toString();
        resetTokens.put(token, user.getEmail());

        // TODO: send token via email (stubbed)
        System.out.println("Password reset token for " + user.getEmail() + ": " + token);
    }

    @Override
    public void resetPassword(ResetPasswordRequest request) {
        String email = resetTokens.get(request.getToken());
        if (email == null) throw new RuntimeException("Invalid or expired token");

        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        resetTokens.remove(request.getToken());
    }
}