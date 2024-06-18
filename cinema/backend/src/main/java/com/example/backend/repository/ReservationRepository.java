
package com.example.backend.repository;
import com.example.backend.models.Reservation;
import com.google.protobuf.ProtocolStringList;
import org.apache.kafka.common.protocol.types.Field;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;


public interface ReservationRepository extends JpaRepository<Reservation,Long> {

    List<Reservation> findByShowShowId(Long showId);
    List<Reservation> findByShowShowIdAndCustomerId(Long showId, Long customerId);

    @Query("SELECT r FROM Reservation r WHERE r.seatNumber IN :seatNumbers AND r.show.showId = :showId")
    List<Reservation> findBySeatNumbersAndShowId(@Param("seatNumbers") List<String> seatNumbers, @Param("showId") long showId);

    @Query("SELECT r FROM Reservation r WHERE r.createdAt < :createdAt AND r.status = 'pending'")
    List<Reservation> findByCreatedAtBeforeAndStatusPending(@Param("createdAt") Date createdAt);
}
