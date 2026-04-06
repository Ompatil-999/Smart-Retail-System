package com.smartretail.service;

import com.smartretail.dto.request.StoreUpdateRequest;
import com.smartretail.dto.response.DashboardResponse;
import com.smartretail.dto.response.StoreResponse;
import com.smartretail.entity.Store;
import com.smartretail.exception.ResourceNotFoundException;
import com.smartretail.mapper.EntityMapper;
import com.smartretail.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class StoreService {

    private final StoreRepository storeRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final BillRepository billRepository;
    private final EntityMapper mapper;

    public StoreResponse getStore(Long storeId) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new ResourceNotFoundException("Store not found"));
        return mapper.toStoreResponse(store);
    }

    @Transactional
    public StoreResponse updateStore(Long storeId, StoreUpdateRequest request) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new ResourceNotFoundException("Store not found"));

        store.setStoreName(request.getStoreName());
        store.setGstNumber(request.getGstNumber());
        if (request.getDefaultTaxRate() != null) {
            store.setDefaultTaxRate(request.getDefaultTaxRate());
        }
        store.setAddress(request.getAddress());
        store.setPhone(request.getPhone());
        store = storeRepository.save(store);
        log.info("Store updated: {}", store.getStoreName());
        return mapper.toStoreResponse(store);
    }

    public DashboardResponse getDashboard(Long storeId) {
        long products = productRepository.countByStoreId(storeId);
        long customers = customerRepository.countByStoreId(storeId);
        long bills = billRepository.countByStoreId(storeId);
        var revenue = billRepository.getTotalRevenue(storeId);
        long lowStock = productRepository.findLowStockProducts(storeId).size();

        return DashboardResponse.builder()
                .totalProducts(products)
                .totalCustomers(customers)
                .totalBills(bills)
                .totalRevenue(revenue)
                .lowStockProducts(lowStock)
                .build();
    }
}
