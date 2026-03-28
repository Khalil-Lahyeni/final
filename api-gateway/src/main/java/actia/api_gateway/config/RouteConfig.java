package actia.api_gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
@Configuration
public class RouteConfig {

    @Bean
    public RouteLocator routeLocator(RouteLocatorBuilder builder) {
        return builder.routes()

                // ── Micro-service ──
                .route("Micro-service", route -> route
                        .path("/api/micro-service/**")
                        .filters(filter -> filter
                                .stripPrefix(2)
                                .tokenRelay()
                        )
                        .uri("http://localhost:8081")
                )

                .build();
    }
}