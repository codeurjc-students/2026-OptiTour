package es.urjc.tfg.optitour.model;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;

@Entity
public class PointOfInterest { // Abbreviated "POI" in the rest of the project's variables and comments

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String name;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    private String description;
    private String city;
    private String address;
    private String coords;

    @ManyToMany(mappedBy = "pois")
    private List<Tour> tours;

    public PointOfInterest() {
    }

    public PointOfInterest(String name, String description, String city, String address, String coords) {
        this.name = name;
        this.description = description;
        this.address = address;
        this.coords = coords;
        this.city = city;
    }

    public PointOfInterest(long id, String name, String description, String address, String coords) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.address = address;
        this.coords = coords;
    }

    public PointOfInterest(long id, String name, String description, String city, String address, String coords,
            List<Tour> tours) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.city = city;
        this.address = address;
        this.coords = coords;
        this.tours = tours;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCoords() {
        return coords;
    }

    public void setCoords(String coords) {
        this.coords = coords;
    }

    public List<Tour> getTours() {
        return tours;
    }

    public void setTours(List<Tour> tours) {
        this.tours = tours;
    }

}