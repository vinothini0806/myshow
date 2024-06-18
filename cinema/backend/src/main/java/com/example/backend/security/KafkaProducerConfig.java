package com.example.backend.security;

import com.example.backend.proto.*;
import io.confluent.kafka.serializers.protobuf.KafkaProtobufSerializer;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.LongSerializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;

import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableKafka
public class KafkaProducerConfig {

    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    @Value("${spring.kafka.properties.schema.registry.url}")
    private String schemaRegistryUrl;

    @Value("${spring.kafka.properties.basic.auth.credentials.source}")
    private String basicAuthCredentialsSource;

    @Value("${spring.kafka.properties.basic.auth.user.info}")
    private String basicAuthUserInfo;

    @Value("${spring.kafka.properties.sasl.jaas.config}")
    private String saslJaasConfig;

    private Map<String, Object> producerConfigs() {
        Map<String, Object> config = new HashMap<>();
        config.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        config.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, LongSerializer.class);
        config.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, KafkaProtobufSerializer.class);
        config.put("schema.registry.url", schemaRegistryUrl);
        config.put("basic.auth.credentials.source", basicAuthCredentialsSource);
        config.put("basic.auth.user.info", basicAuthUserInfo);
        config.put("security.protocol", "SASL_SSL");
        config.put("sasl.mechanism", "PLAIN");
        config.put("sasl.jaas.config", saslJaasConfig);
        return config;
    }

    private <T> ProducerFactory<Long, T> createProducerFactory() {
        return new DefaultKafkaProducerFactory<>(producerConfigs());
    }

    @Bean
    public KafkaTemplate<Long, MovieProtos.Movie> movieKafkaTemplate() {
        return new KafkaTemplate<>(createProducerFactory());
    }

    @Bean
    public KafkaTemplate<Long, SeatProtos.Seat> seatKafkaTemplate() {
        return new KafkaTemplate<>(createProducerFactory());
    }
    @Bean
    public KafkaTemplate<Long, ShowProtos.Show> showKafkaTemplate() {
        return new KafkaTemplate<>(createProducerFactory());
    }
    @Bean
    public KafkaTemplate<Long, CinemaProtos.Cinema> cinemaKafkaTemplate() {
        return new KafkaTemplate<>(createProducerFactory());
    }
}
