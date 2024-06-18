

package com.example.backend.kafka;
import com.example.backend.proto.SeatProtos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component

public class SeatProducer {
    @Autowired
    private KafkaTemplate<Long, SeatProtos.Seat> seatKafkaTemplate;

    public void sendMessage(SeatProtos.Seat seat) {

        seatKafkaTemplate.send("seat", seat);
    }

}
