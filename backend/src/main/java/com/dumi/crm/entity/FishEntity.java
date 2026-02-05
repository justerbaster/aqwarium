package com.dumi.crm.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.Date;

@Data
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "fish")
public class FishEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private Long supplierId;
    private Date arrrivalDate;
    private Long size;
    private  String name;
    private String description;
    private Long categoryId;
    private Long stockQuantity;
    private String healthStatus;
    private Double price;

}
