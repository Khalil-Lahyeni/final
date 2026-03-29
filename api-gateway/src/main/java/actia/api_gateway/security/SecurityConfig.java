package actia.api_gateway.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.oidc.web.server.logout.OidcClientInitiatedServerLogoutSuccessHandler;
import org.springframework.security.oauth2.client.registration.ReactiveClientRegistrationRepository;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.WebFilterExchange;

import org.springframework.security.web.server.authentication.ServerAuthenticationSuccessHandler;
import org.springframework.security.web.server.authentication.logout.ServerLogoutSuccessHandler;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebSession;
import reactor.core.publisher.Mono;

import java.net.URI;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

        @Value("${app.logout-url:http://localhost:4200}")
    private String logoutUrl;

    private final ReactiveClientRegistrationRepository clientRegistrationRepository;

    public SecurityConfig(ReactiveClientRegistrationRepository clientRegistrationRepository) {
        this.clientRegistrationRepository = clientRegistrationRepository;
    }

    @Bean
    public SecurityWebFilterChain securityFilterChain(ServerHttpSecurity http) {
        http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
 
                .authorizeExchange(exchanges -> exchanges
                        .pathMatchers("/actuator/health", "/actuator/info").permitAll()
                        .pathMatchers("/login/oauth2/code/**").permitAll()
                        .pathMatchers("/oauth2/**").permitAll()
                        .anyExchange().authenticated()
                )

                .oauth2Login(oauth2 -> oauth2
                        .authenticationSuccessHandler(
                                redirectHandler()
                        )
                )

                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessHandler(oidcAndLocalLogoutHandler())

                );

        return http.build();
    }

    private ServerLogoutSuccessHandler oidcAndLocalLogoutHandler() {
        OidcClientInitiatedServerLogoutSuccessHandler oidc =
                new OidcClientInitiatedServerLogoutSuccessHandler(clientRegistrationRepository);

        oidc.setPostLogoutRedirectUri("{baseUrl}");

        return (exchange, authentication) ->
                // Étape 1 : D'abord le logout OIDC (a besoin du id_token dans la session)
                oidc.onLogoutSuccess(exchange, authentication)
                        .then(exchange.getExchange().getSession()
                                .flatMap(WebSession::invalidate))
                        .then(Mono.fromRunnable(() -> {
                            exchange.getExchange().getResponse().addCookie(
                                    ResponseCookie.from("SESSION", "")
                                            .path("/")
                                            .maxAge(0)
                                            .httpOnly(true)
                                            .build());
                        }));
    }
    private ServerAuthenticationSuccessHandler redirectHandler() {
        return (WebFilterExchange webFilterExchange, Authentication authentication) -> {
            ServerWebExchange exchange = webFilterExchange.getExchange();
            exchange.getResponse().setStatusCode(HttpStatus.FOUND);
            exchange.getResponse().getHeaders()
                    .setLocation(URI.create("http://localhost:4200"));
            return exchange.getResponse().setComplete();
        };
    }

}


