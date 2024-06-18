package com.example.backend.service;

import com.example.backend.dto.*;
import com.example.backend.models.Movie;
import com.example.backend.models.Show;
import com.example.backend.models.User;
import com.example.backend.repository.MovieRepository;
import com.example.backend.repository.ShowRepository;
import com.example.backend.repository.UserRepository;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShowService {
    private final ShowRepository showRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final MovieRepository movieRepository;

    public Show createShow(String token, ShowCreateRequestDTO showCreateRequestDTO) throws IOException {
        try {
            if (token.startsWith("Bearer")) {
                token = token.substring(7);
            }
            String username = jwtService.extractClaim(token, Claims::getSubject);
            Optional<User> users = userRepository.findByUsername(username);
            if (users.isEmpty()) {
                throw new Exception("User not found");
            }
            User user = userRepository.findById(users.get().getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            Movie movie = movieRepository.findById(showCreateRequestDTO.getMovieId())
                    .orElseThrow(() -> new RuntimeException("Movie not found"));

            Show show = new Show();
            show.setMovie(movie);
            show.setPrice(showCreateRequestDTO.getPrice());
            show.setShowDate(showCreateRequestDTO.getShowDate());
            show.setShowTime(showCreateRequestDTO.getShowTime());
            show.setUser(user);

            return showRepository.save(show);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public List<ShowResponseDTO> viewShow(String token) throws Exception {
        if (token.startsWith("Bearer")) {
            token = token.substring(7);
        }
        String username = jwtService.extractClaim(token, Claims::getSubject);
        Optional<User> users = userRepository.findByUsername(username);
        if (users.isEmpty()) {
            throw new Exception("User not found");
        }

        List<Show> shows = showRepository.findByUserId(users.get().getId());
        if (shows.isEmpty()) {
            throw new IllegalArgumentException("Shows not found");
        }

        List<Long> movieIds = shows.stream()
                .map(show -> show.getMovie().getMovieId())
                .collect(Collectors.toList());

        List<Movie> movies = movieRepository.findAllById(movieIds);

        Map<Long, Movie> movieMap = movies.stream()
                .collect(Collectors.toMap(Movie::getMovieId, movie -> movie));


        return shows.stream()
                .map(show -> {
                    Movie movie = movieMap.get(show.getMovie().getMovieId());
                    return new ShowResponseDTO(
                            show.getShowId(),
                            show.getShowDate(),
                            show.getShowTime(),
                            show.getPrice(),
                            show.getMovie().getMovieId(),
                            movie.getName(),
                            movie.getImageData()
                    );
                })
                .collect(Collectors.toList());
    }


}
