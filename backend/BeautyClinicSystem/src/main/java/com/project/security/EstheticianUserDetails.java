package com.project.security;

import com.project.models.Esthetician;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.Serializable;
import java.util.Collection;
import java.util.List;

public class EstheticianUserDetails implements UserDetails, Serializable {
    private final Esthetician esthetician;

    public EstheticianUserDetails(Esthetician esthetician) {
        this.esthetician = esthetician;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_ESTHETICIAN"));
    }

    public String getCpf() {
        return this.esthetician.getCpf();
    }

    public Esthetician getEsthetician(){
        return this.esthetician;
    }

    @Override
    public String getPassword() {
        return esthetician.getPassword();
    }

    @Override
    public String getUsername() {
        return esthetician.getEmail();
    }

    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }
}
