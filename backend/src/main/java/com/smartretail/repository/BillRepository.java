package com.smartretail.repository;

import com.smartretail.entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {
    List<Bill> findByStoreIdOrderByCreatedAtDesc(Long storeId);
    Optional<Bill> findByIdAndStoreId(Long id, Long storeId);
    boolean existsByBillNumberAndStoreId(String billNumber, Long storeId);
    List<Bill> findByCustomerIdAndStoreId(Long customerId, Long storeId);
    long countByStoreId(Long storeId);

    @Query("SELECT COALESCE(SUM(b.totalAmount), 0) FROM Bill b WHERE b.storeId = :storeId")
    BigDecimal getTotalRevenue(@Param("storeId") Long storeId);
}
