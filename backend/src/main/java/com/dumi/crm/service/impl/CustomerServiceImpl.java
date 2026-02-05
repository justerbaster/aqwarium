package com.dumi.crm.service.impl;

import com.dumi.crm.entity.CustomerEntity;
import com.dumi.crm.model.Customer;
import com.dumi.crm.repository.CustomerRepository;
import com.dumi.crm.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final ModelMapper modelMapper;

    @Override
    public void addCustomer(Customer customer) {
        CustomerEntity customerEntity = modelMapper.map(customer, CustomerEntity.class);
        customerRepository.save(customerEntity);
    }

    @Override
    public void deleteCustomer(Long id) {

    }

    @Override
    public boolean updateCustomer(Customer customer) {
        return false;
    }

    @Override
    public List<Customer> getCustomer() {
        return List.of();
    }

    @Override
    public Customer findById(Long id) {
        return null;
    }

    @Override
    public List<Customer> getByName(String name) {
        return List.of();
    }

    @Override
    public Customer getByNic(String nic) {
        return null;
    }
}
