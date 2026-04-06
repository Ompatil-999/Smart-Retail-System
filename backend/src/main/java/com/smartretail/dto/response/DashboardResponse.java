package com.smartretail.dto.response;

import lombok.*;
import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DashboardResponse {
    private long totalProducts;
    private long totalCustomers;
    private long totalBills;
    private BigDecimal totalRevenue;
    private long lowStockProducts;
}
