package es.urjc.tfg.optitour.model;

import java.sql.Blob;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;

@Entity
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Lob
    private Blob imageFile;

    @ManyToOne
    @JoinColumn(name = "tour_id")
    private Tour tour;

    public Tour getTour() {
        return tour;
    }

    public void setTour(Tour tour) {
        this.tour = tour;
    }

    public PointOfInterest getPoi() {
        return poi;
    }

    public void setPoi(PointOfInterest poi) {
        this.poi = poi;
    }

    @ManyToOne
    @JoinColumn(name = "poi_id")
    private PointOfInterest poi;

    public Image() {

    }

    public long getId() {
        return id;
    }

    public void setImageFile(Blob imageFile) {
        this.imageFile = imageFile;
    }

    public Blob getImageFile() {
        return imageFile;
    }
}