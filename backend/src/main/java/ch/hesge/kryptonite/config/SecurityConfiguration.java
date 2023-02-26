package ch.hesge.kryptonite.config;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;


/**
 * Spring configuration class to set up  security configuration for the webapp.
 * This class uses JwtAuthenticationFilter, AuthenticationProvider and CORS configuration to provide authentication,
 * authorization, and security with specific methods and headers.
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    /**
     * Path to the H2 console from application configuration properties.
     */
    @Value("${spring.h2.console.path}")
    private String h2Console;


    /**
     * Spring security filter chain to secure the application
     *
     * @param http the HTTP security
     * @return a SecurityFilterChain
     * @throws Exception if there is an error
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // Enable CORS, disable CSRF, authorize HTTP requests
        // Allow api (/api/**) and h2-console path (/)
        // Also setup session management to stateless and add JWT filters
        http
                .cors()
                .and()
                .csrf()
                .disable()
                .authorizeHttpRequests()
                .requestMatchers("/api/**")
                .permitAll()
                .requestMatchers("/")
                .permitAll()
                .requestMatchers(AntPathRequestMatcher.antMatcher(h2Console + "/**"))
                .permitAll()
                .anyRequest()
                .authenticated()
                .and()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        // Disable frameOptions headers to allow H2-console
        http.headers().frameOptions().disable();
        return http.build();
    }

    /**
     * CORS configuration for the application
     *
     * @return a CorsConfigurationSource
     */
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Allow specific origins, methods, and headers
        configuration.setAllowedOrigins(List.of("http://localhost:3000", "https://kryptonite-front.herokuapp.com/", "https://krypto-backend.adron.ch/", "null"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
        configuration.setAllowCredentials(true);
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type"));
        configuration.setExposedHeaders(List.of("Authorization"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
