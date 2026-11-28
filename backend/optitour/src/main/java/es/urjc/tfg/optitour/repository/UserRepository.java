package es.urjc.tfg.optitour.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import es.urjc.tfg.optitour.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    public Optional<User> findByEmail(String email);

    public Optional<User> findById(long id);

    public Optional<User> findByUserName(String userName);

    public int countByRoles(String role);

    @Query("SELECT u.createdAt FROM User u")
    public List<LocalDateTime> findAllDates();

    @Query("SELECT u.isBanned FROM User u ORDER BY u.id ASC")
    public List<Boolean> findAllBanned();
}
