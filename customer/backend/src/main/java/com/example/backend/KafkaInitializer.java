package com.example.backend;

import org.apache.kafka.clients.admin.AdminClient;
import org.apache.kafka.clients.admin.AdminClientConfig;
import org.apache.kafka.clients.admin.DescribeClusterResult;
import org.apache.kafka.common.KafkaFuture;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Properties;

public class KafkaInitializer {
    private static final Logger LOGGER = LoggerFactory.getLogger(KafkaInitializer.class);
    private static final String KAFKA_BOOTSTRAP_SERVERS = "localhost:9092";

    public static void initializeKafka() {
        Properties adminClientProps = new Properties();
        adminClientProps.put(AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG, KAFKA_BOOTSTRAP_SERVERS);
        try (AdminClient adminClient = AdminClient.create(adminClientProps)) {
            DescribeClusterResult clusterResult = adminClient.describeCluster();
            KafkaFuture<String> clusterIdFuture = clusterResult.clusterId();
            String clusterId = clusterIdFuture.get();
            LOGGER.info("Kafka cluster ID: {}", clusterId);
            // Proceed with Kafka initialization logic
        } catch (Exception e) {
            LOGGER.error("Failed to initialize Kafka: {}", e.getMessage());
            // Handle initialization failure
        }
    }

}
