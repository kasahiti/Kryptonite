package ch.hesge.kryptonite;

import ch.hesge.kryptonite.storage.StorageProperties;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableConfigurationProperties(StorageProperties.class)
@EnableScheduling
public class KryptoniteApplication {

    public static void main(String[] args) {
        SpringApplication.run(KryptoniteApplication.class, args);
    }

    @Bean
    CommandLineRunner init() {
        return args -> System.out.println("CommandLineRunner init()");
    }
}
