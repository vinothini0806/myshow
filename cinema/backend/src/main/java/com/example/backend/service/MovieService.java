package com.example.backend.service;


import com.example.backend.dto.MovieCreateRequestDTO;
import com.example.backend.dto.MovieResponseDTO;
import com.example.backend.dto.UpdateMovieRequestDTO;
import com.example.backend.models.Movie;

import com.example.backend.models.User;
import com.example.backend.repository.MovieRepository;
import com.example.backend.repository.ShowRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.utils.ImageUtils;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@RequiredArgsConstructor
@Service
public class MovieService {
    private final MovieRepository movieRepository;
    private final UserRepository userRepository;
    private final ShowRepository showRepository;
    private final JwtService jwtService;


    public Movie uploadMovie(String token, MultipartFile file, MovieCreateRequestDTO metadata) throws IOException {
        try {
            if (token.startsWith("Bearer")) {
                token = token.substring(7);
            }
            String username = jwtService.extractClaim(token, Claims::getSubject);
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));


            Movie movie = new Movie();
            movie.setName(metadata.getName());
            movie.setDescription(metadata.getDescription());
            movie.setHours(metadata.getHours());
            movie.setMinutes(metadata.getMinutes());
            movie.setLanguage(metadata.getLanguage());
            movie.setReleaseDate(metadata.getReleaseDate());
            movie.setFileName(file.getOriginalFilename());
            movie.setContentType(file.getContentType());
            movie.setImageData(ImageUtils.compressImage(file.getBytes()));

            return movieRepository.save(movie);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public MovieResponseDTO getMovie(long id) {
        Optional<Movie> movieOptional = movieRepository.findById(id);

        if (movieOptional.isPresent()) {
            MovieResponseDTO movieResposneDTO = new MovieResponseDTO();
            movieResposneDTO.setId(movieOptional.get().getMovieId());
            movieResposneDTO.setName(movieOptional.get().getName());
            movieResposneDTO.setDescription(movieOptional.get().getDescription());
            movieResposneDTO.setHours(movieOptional.get().getHours());
            movieResposneDTO.setMinutes(movieOptional.get().getMinutes());
            movieResposneDTO.setReleaseDate(movieOptional.get().getReleaseDate());
            movieResposneDTO.setLanguage(movieOptional.get().getLanguage());
            movieResposneDTO.setImageData(ImageUtils.decompressImage(movieOptional.get().getImageData()));

            return movieResposneDTO;
        } else {
            throw new IllegalArgumentException("Movie with ID " + id + " not found");
        }
    }

    public List<MovieResponseDTO> getAllMovies(String token) throws Exception {
        if (token.startsWith("Bearer")) {
            token = token.substring(7);
        }
        String username = jwtService.extractClaim(token, Claims::getSubject);
        Optional<User> user = userRepository.findByUsername(username);

        if (user.isEmpty()) {
            throw new Exception("User not found");
        }

        List<Movie> movies = movieRepository.findAll();


        if (!movies.isEmpty()) {
            return movies.stream()
                    .map(movie -> new MovieResponseDTO(movie.getMovieId(),movie.getName(), movie.getDescription(), movie.getHours(),movie.getMinutes(),movie.getReleaseDate(),
                            movie.getLanguage(),movie.getFileName(),ImageUtils.decompressImage(movie.getImageData())))
                    .collect(Collectors.toList());
        } else {
            throw new IllegalArgumentException("Movies not found");
        }
    }


    public Movie updateMovie(String token, MultipartFile file, UpdateMovieRequestDTO metadata)  {
        try {
            if (token.startsWith("Bearer")) {
                token = token.substring(7);
            }
            String username = jwtService.extractClaim(token, Claims::getSubject);
            Optional<User> user = userRepository.findByUsername(username);

            if (user.isEmpty()) {
                throw new Exception("User not found");
            }
            Optional<Movie> movieOptional = movieRepository.findById(metadata.getId());

            if (movieOptional.isEmpty()){
                throw new Exception("Movie not found");
            }

            Movie moviedata = movieOptional.get();

            if (metadata.getName() != null){
                moviedata.setName(metadata.getName());
            }

            if (metadata.getDescription() != null){
                moviedata.setDescription(metadata.getDescription());
            }

            if (metadata.getHours() != null){
                moviedata.setHours(metadata.getHours() );
            }

            if (metadata.getMinutes()  != null){
                moviedata.setMinutes(metadata.getMinutes() );
            }
            if (metadata.getReleaseDate()  != null){
                moviedata.setReleaseDate(metadata.getReleaseDate() );
            }
            if (metadata.getLanguage()  != null){
                moviedata.setLanguage(metadata.getLanguage() );
            }
            if (file  != null){
                moviedata.setImageData(ImageUtils.compressImage(file.getBytes()));
                moviedata.setFileName(file.getOriginalFilename());
                moviedata.setContentType(file.getContentType());
            }


            movieRepository.save(moviedata);

            return moviedata;

        }catch (Exception e){
            System.out.println(e.getMessage());
            return null;
        }

    }

    public void deleteMovie(Long id, String token) throws Exception {
        if (token.startsWith("Bearer")) {
            token = token.substring(7);
        }
        String username = jwtService.extractClaim(token, Claims::getSubject);
        Optional<User> user = userRepository.findByUsername(username);

        if (user.isEmpty()) {
            throw new Exception("User not found");
        }

        Optional<Movie> movieOptional = movieRepository.findById(id);
        if (movieOptional.isEmpty()) {
            throw new Exception("Movie not found");
        }

        movieRepository.delete(movieOptional.get());
    }



}
