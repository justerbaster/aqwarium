package com.dumi.crm.service;

import com.dumi.crm.model.Customer;

import java.util.List;

public interface CustomerService {
    void addCustomer(Customer customer);

    void deleteCustomer(Long id);

    boolean updateCustomer(Customer customer);

    List<Customer> getCustomer();

    Customer findById(Long id);

    List<Customer> getByName(String name);

    Customer getByNic(String nic);
}
