package com.dumi.crm.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.Date;

@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Fish {
    private Long id;
    private Long supplierId;
    private Date arrrivalDate;
    private Long size;
    private String name;
    private String description;
    private Long categoryId;
    private Long stockQuantity;
    private String healthStatus;
    private Double price;
}
