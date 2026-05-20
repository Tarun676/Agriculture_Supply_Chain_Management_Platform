package com.agri.platform;

import com.agri.platform.entity.Bid;
import com.agri.platform.entity.Product;
import com.agri.platform.entity.User;
import com.agri.platform.repository.BidRepository;
import com.agri.platform.repository.ProductRepository;
import com.agri.platform.repository.UserRepository;
import com.agri.platform.service.BidService;
import com.agri.platform.service.ProductService;
import com.agri.platform.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest(classes = PlatformApplication.class)
@ActiveProfiles("test")
class PlatformApplicationTests {

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private BidRepository bidRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    private UserService userService;
    private ProductService productService;
    private BidService bidService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        userService = new UserService(userRepository, passwordEncoder);
        productService = new ProductService(productRepository, userService);
        bidService = new BidService(bidRepository, productService, userService);
    }

    @Test
    void contextLoads() {
        // Confirms Spring Context loads without errors
    }

    @Test
    void testUserRegisterSuccess() {
        User user = User.builder()
                .name("Farmer Bob")
                .email("bob@agri.com")
                .password("plainPassword")
                .role("FARMER")
                .build();

        when(userRepository.existsByEmail(user.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(user.getPassword())).thenReturn("hashedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User registered = userService.register(user);

        assertNotNull(registered);
        assertEquals("hashedPassword", registered.getPassword());
        assertEquals("FARMER", registered.getRole());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testUserRegisterExistingEmailThrowsException() {
        User user = User.builder()
                .name("Farmer Bob")
                .email("bob@agri.com")
                .password("plainPassword")
                .role("FARMER")
                .build();

        when(userRepository.existsByEmail(user.getEmail())).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> userService.register(user));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testCreateProductSuccess() {
        User farmer = User.builder().id(1L).name("Bob").email("bob@agri.com").role("FARMER").build();
        Product product = Product.builder()
                .name("Wheat")
                .description("Organic")
                .price(BigDecimal.valueOf(2.50))
                .quantity(100.0)
                .farmerId(1L)
                .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(farmer));
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Product created = productService.createProduct(product);

        assertNotNull(created);
        assertEquals(BigDecimal.valueOf(2.50), created.getPrice());
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    void testCreateProductNonFarmerThrowsException() {
        User buyer = User.builder().id(2L).name("Alice").email("alice@agri.com").role("BUYER").build();
        Product product = Product.builder()
                .name("Wheat")
                .price(BigDecimal.valueOf(2.50))
                .quantity(100.0)
                .farmerId(2L)
                .build();

        when(userRepository.findById(2L)).thenReturn(Optional.of(buyer));

        assertThrows(IllegalArgumentException.class, () -> productService.createProduct(product));
        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    void testPlaceBidTooLowThrowsException() {
        User buyer = User.builder().id(2L).name("Alice").email("alice@agri.com").role("BUYER").build();
        Product product = Product.builder()
                .id(1L)
                .name("Wheat")
                .price(BigDecimal.valueOf(10.00))
                .quantity(100.0)
                .farmerId(1L)
                .build();

        Bid bid = Bid.builder()
                .bidAmount(BigDecimal.valueOf(9.00)) // Lower than starting price of 10.00
                .productId(1L)
                .buyerId(2L)
                .build();

        when(userRepository.findById(2L)).thenReturn(Optional.of(buyer));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        assertThrows(IllegalArgumentException.class, () -> bidService.placeBid(bid));
        verify(bidRepository, never()).save(any(Bid.class));
    }

    @Test
    void testPlaceBidOutbiddingSuccess() {
        User buyer = User.builder().id(2L).name("Alice").email("alice@agri.com").role("BUYER").build();
        Product product = Product.builder()
                .id(1L)
                .name("Wheat")
                .price(BigDecimal.valueOf(10.00))
                .quantity(100.0)
                .farmerId(1L)
                .build();

        Bid existingBid = Bid.builder().id(5L).bidAmount(BigDecimal.valueOf(12.00)).productId(1L).buyerId(3L).build();
        Bid newBid = Bid.builder()
                .bidAmount(BigDecimal.valueOf(13.00)) // Higher than existing bid of 12.00
                .productId(1L)
                .buyerId(2L)
                .build();

        when(userRepository.findById(2L)).thenReturn(Optional.of(buyer));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(bidRepository.findByProductIdOrderByBidAmountDesc(1L)).thenReturn(new ArrayList<>(Collections.singletonList(existingBid)));
        when(bidRepository.save(any(Bid.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Bid placed = bidService.placeBid(newBid);

        assertNotNull(placed);
        assertEquals(BigDecimal.valueOf(13.00), placed.getBidAmount());
        verify(bidRepository, times(1)).save(any(Bid.class));
    }
}
