package com.example.backend.kafka;
import com.example.backend.proto.ShowProtos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class ShowProducer {
    @Autowired
    private KafkaTemplate<Long, ShowProtos.Show> showKafkaTemplate;

    public void sendMessage(ShowProtos.Show show) {

        showKafkaTemplate.send("shows", show);
    }

}