package com.example.backend;

import org.modelmapper.ModelMapper;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import static com.example.backend.KafkaInitializer.initializeKafka;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
		initializeKafka();

	}
	@Bean
	public ModelMapper modelMapper() {
		return new ModelMapper();
	}

}
