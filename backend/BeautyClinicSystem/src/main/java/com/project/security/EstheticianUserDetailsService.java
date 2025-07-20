package com.project.security;

import com.project.models.Esthetician;
import com.project.repositories.EstheticianRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EstheticianUserDetailsService implements UserDetailsService {
    private final EstheticianRepository estheticianRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Esthetician esthetician = estheticianRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("esthetician-not-found"));
        return new EstheticianUserDetails(esthetician);
    }
}
