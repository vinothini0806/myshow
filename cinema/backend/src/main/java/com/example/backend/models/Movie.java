package com.example.backend.models;

import jakarta.persistence.*;
import javax.sql.rowset.serial.SerialBlob;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Blob;
import java.sql.SQLException;
import java.util.Date;

@Data
@Builder
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "movie")
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "movie_id")
    private Long movieId;
    private String name;
    private String description;
    private Long hours;
    private Long minutes;
    private String fileName;
    private String contentType;
    private String language;

    @Temporal(TemporalType.DATE)
    @Column(name = "release_date")
    private Date releaseDate;
    @Lob
    @Column(name = "imagedata")
    private Blob imageData;

//    @ManyToOne
//    @JoinColumn(name = "id",nullable = false)
//    private User user;

    // Setter and getter for imageData
    public void setImageData(byte[] data) {
        try {
            this.imageData = new SerialBlob(data);
        } catch (SQLException e) {
            // Handle SQLException appropriately
            e.printStackTrace();
        }
    }

    public byte[] getImageData() {
        try {
            return this.imageData.getBytes(1, (int) this.imageData.length());
        } catch (SQLException e) {
            // Handle SQLException appropriately
            e.printStackTrace();
            return null;
        }
    }
}
