package com.project.security;

import com.project.models.Esthetician;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@Service
public class AuthService {
    public String getLoggedInEstheticianCpf() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() || !(authentication.getPrincipal() instanceof EstheticianUserDetails userDetails)) {
            throw new ResponseStatusException(UNAUTHORIZED, "user-not-authenticated");
        }

        return userDetails.getCpf();
    }


    public Esthetician getLoggedInEsthetician() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() || !(authentication.getPrincipal() instanceof EstheticianUserDetails userDetails)) {
            throw new ResponseStatusException(UNAUTHORIZED, "user-not-authenticated");
        }

        return userDetails.getEsthetician();
    }
}
