package com.example.FloraX.Service;

import com.example.FloraX.Dto.*;
import com.example.FloraX.Dto.Auth.*;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    void forgetPassword(ForgetPasswordRequest request);
    void resetPassword(ResetPasswordRequest request);
}