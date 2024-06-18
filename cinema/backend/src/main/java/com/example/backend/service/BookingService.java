
package com.example.backend.service;
import com.example.backend.models.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.utils.ImageUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.example.backend.dto.*;
import com.example.backend.models.Movie;
import com.example.backend.models.Reservation;
import com.example.backend.models.Show;
import com.example.backend.repository.MovieRepository;
import com.example.backend.repository.ReservationRepository;

import com.example.backend.repository.ShowRepository;
import com.server.proto.*;
import io.grpc.Status;
import io.grpc.stub.StreamObserver;
import io.jsonwebtoken.Claims;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.lognet.springboot.grpc.GRpcService;
import org.springframework.mail.javamail.MimeMessageHelper;

import java.text.SimpleDateFormat;
import org.springframework.mail.javamail.JavaMailSender;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import org.springframework.scheduling.annotation.Scheduled;

@GRpcService
@RequiredArgsConstructor
@Slf4j
public class BookingService extends BookingServiceGrpc.BookingServiceImplBase {
    private final ReservationRepository reservationRepository;
    private final ShowRepository showRepository;
    private final MovieRepository movieRepository;
    private  final JavaMailSender mailSender;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    private static final Logger logger = LoggerFactory.getLogger(BookingService.class);

    @Override
    public void createBooking(SelectedBookingRequest selectedBookingRequest, StreamObserver<SelectedBookingResponse> responseObserver) {
        logger.info("Received booking request for Show ID: {}, Customer ID: {}, Seat Numbers: {}", selectedBookingRequest.getShowId(), selectedBookingRequest.getCustomerId(), selectedBookingRequest.getSeatNumbersList());
        try {
            Show show = showRepository.findById(selectedBookingRequest.getShowId()).orElseThrow(()->new RuntimeException("Show not found"));
            List<BookingRequestDTO> bookingList = selectedBookingRequest.getSeatNumbersList().stream()
                    .map(seatNumber -> new BookingRequestDTO(selectedBookingRequest.getShowId(),seatNumber,selectedBookingRequest.getCustomerId()))
                    .collect(Collectors.toList());

            for(BookingRequestDTO bookingRequestDTO : bookingList) {
                Reservation reservation = new Reservation();
                reservation.setShow(show);
                reservation.setCustomerId(selectedBookingRequest.getCustomerId());
                reservation.setSeatNumber(bookingRequestDTO.getSeatNumber());
                reservation.setStatus("pending");
                reservation.setCreatedAt(new Date());
                reservationRepository.save(reservation);
            }

            SelectedBookingResponse selectedBookingResponse =  SelectedBookingResponse.newBuilder()
                    .setIsBookingCreated("true")
                    .build();
            responseObserver.onNext(selectedBookingResponse);
            responseObserver.onCompleted();

        } catch (Exception e) {
            logger.error("Error occurred while creating booking", e);
            System.out.println(e.getMessage());
            responseObserver.onError(Status.INTERNAL
                    .withDescription("Internal server error")
                    .withCause(e)
                    .asRuntimeException());
            SelectedBookingResponse selectedBookingResponse =  SelectedBookingResponse.newBuilder()
                    .setIsBookingCreated("false")
                    .build();
            responseObserver.onNext(selectedBookingResponse);
            responseObserver.onCompleted();
        }
    }
    @Override
    public void getBookedSeats(NewBookingRequest newBookingRequest, StreamObserver<NewBookingResponse> responseObserver) {

        try{
            List<Reservation> reservationList = reservationRepository.findByShowShowId(newBookingRequest.getShowId());
            if (!reservationList.isEmpty()) {
                List<String> seatNumbers = reservationList.stream()
                        .map(Reservation::getSeatNumber)
                        .collect(Collectors.toList());

                NewBookingResponse response = NewBookingResponse.newBuilder()
                        .setShowId(newBookingRequest.getShowId())
                        .addAllSeatNumbers(seatNumbers)
                        .build();

                responseObserver.onNext(response);
                responseObserver.onCompleted();
            } else {
                NewBookingResponse response = NewBookingResponse.newBuilder()
                        .setShowId(newBookingRequest.getShowId())
                        .build();

                responseObserver.onNext(response);
                responseObserver.onCompleted();
            }

        }catch (Exception e){
            System.out.println(e.getMessage());
            responseObserver.onError(e);
        }

    }
    public List<BookingResponseDTO> getBookingForShow(String token,Long id) throws Exception {
        if (token.startsWith("Bearer")) {
            token = token.substring(7);
        }
        String username = jwtService.extractClaim(token, Claims::getSubject);
        Optional<User> user = userRepository.findByUsername(username);

        if (user.isEmpty()) {
            throw new Exception("User not found");
        }
        List<Reservation> bookings = reservationRepository.findByShowShowId(id);


        if (!bookings.isEmpty()) {
            return bookings.stream()
                    .map(booking -> new BookingResponseDTO(booking.getSeatNumber()))
                    .collect(Collectors.toList());
        } else {
            throw new IllegalArgumentException("Bookings not found");
        }
    }


    @Override
    public void proceedConfirmation(confirmationBookingRequest request, StreamObserver<confirmationBookingResponse> responseObserver) {
        if (request.getIsBookingConfirmed()) {
            List<Reservation> reservations = reservationRepository.findBySeatNumbersAndShowId(request.getSeatNumbersList(), request.getShowId());
            boolean isBookingConfirmedByCinema = false;

            List<Reservation> customerReservations = reservations.stream()
                    .filter(reservation -> reservation.getCustomerId() == request.getCustomerId())
                    .collect(Collectors.toList());

            if (!customerReservations.isEmpty()) {
                // Keep only the reservations for the given customer ID
                customerReservations.forEach(reservation -> reservation.setStatus("confirmed"));
                reservationRepository.saveAll(customerReservations);

                // Delete other reservations for the given seat numbers and show ID
                List<Reservation> otherReservations = reservations.stream()
                        .filter(reservation -> reservation.getCustomerId() != request.getCustomerId())
                        .collect(Collectors.toList());
                reservationRepository.deleteAll(otherReservations);

                isBookingConfirmedByCinema = true;
//                  isBookingConfirmedByCinema = false;
            }

            confirmationBookingResponse response = confirmationBookingResponse.newBuilder()
                    .setIsBookingConfirmedByCinema(isBookingConfirmedByCinema)
                    .build();

            responseObserver.onNext(response);
            responseObserver.onCompleted();
        } else {
            confirmationBookingResponse response = confirmationBookingResponse.newBuilder()
                    .setIsBookingConfirmedByCinema(false)
                    .build();

            responseObserver.onNext(response);
            responseObserver.onCompleted();
        }
    }


    @Scheduled(fixedRate = 60000) // Run every minute
    public void cleanupExpiredBookings() {
        Date tenMinutesAgo = new Date(System.currentTimeMillis() - TimeUnit.MINUTES.toMillis(10));
        List<Reservation> expiredBookings = reservationRepository.findByCreatedAtBeforeAndStatusPending(tenMinutesAgo);

        reservationRepository.deleteAll(expiredBookings);
    }
    @Override
    public void emailConfirmation(SelectedPaymentRequest selectedPaymentRequest, StreamObserver<emailResponse> responseObserver) {

        try{

            if (selectedPaymentRequest.getIsPaymentSuccess()) {
                Optional<Show> show = showRepository.findById(selectedPaymentRequest.getShowId());
                Optional<Movie> movie = movieRepository.findById(show.get().getMovie().getMovieId());
                List<Reservation> reservationList = reservationRepository.findByShowShowIdAndCustomerId(selectedPaymentRequest.getShowId(),Long.parseLong(selectedPaymentRequest.getCustomerId()));
                List<String> seatNumbers = reservationList.stream()
                        .map(Reservation::getSeatNumber)
                        .collect(Collectors.toList());

                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd"); // Define your date format
                String formattedDate = sdf.format(show.get().getShowDate());

                SimpleDateFormat sdfTime = new SimpleDateFormat("HH:mm:ss"); // Define your time format
                String formattedTime = sdfTime.format(show.get().getShowTime());

                emailResponse response = emailResponse.newBuilder()
                        .setShowDate(formattedDate)
                        .setShowTime(formattedTime)
                        .setMovieName(movie.get().getName())
                        .setMovieName(movie.get().getName())
                        .addAllSeatNumbers(seatNumbers)
                        .setTotalPrice(seatNumbers.size()*show.get().getPrice())
                        .build();
                sendEmail(selectedPaymentRequest.getEmail(), response.getMovieName() , response.getShowTime() , response.getShowDate(), response.getSeatNumbersList().toArray(new String[0]), response.getTotalPrice());
                responseObserver.onNext(response);
                responseObserver.onCompleted();
            } else {
                List<Reservation> reservationList = reservationRepository.findByShowShowIdAndCustomerId(selectedPaymentRequest.getShowId(),Long.parseLong(selectedPaymentRequest.getCustomerId()));
                reservationRepository.deleteAll(reservationList);
                emailResponse response = emailResponse.newBuilder()
                        .setShowDate(null)
                        .setShowTime(null)
                        .setMovieName(null)
                        .setMovieName(null)
                        .addAllSeatNumbers(null)
                        .setTotalPrice(0)
                        .build();


            }

        }catch (Exception e){
            responseObserver.onError(e);
        }

    }

    public void sendEmail(String email, String movieName, String showTime, String ShowDate, String[] seatNumbers, Long totalPrice) throws MessagingException {

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message);
            helper.setTo(email);
            helper.setSubject("Your show booked successfully");
            String seatNumbersStr = String.join(", ", seatNumbers); // Convert seatNumbers array to a comma-separated string

            String messages = "Hello " + email + ",\n\n"
                    + "Thank you for booking tickets!\n\n"
                    + "Movie: " + movieName + "\n"
                    + "Show Date: " + ShowDate + "\n"
                    + "Show Time: " + showTime + "\n"
                    + "Seat Numbers: " + seatNumbersStr + "\n"
                    + "Total Price: Rs." + totalPrice + "\n\n"
                    + "Enjoy the show!";

            helper.setText(messages, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }


    }


}
