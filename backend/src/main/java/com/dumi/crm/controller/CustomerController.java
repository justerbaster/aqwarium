package com.dumi.crm.controller;

import com.dumi.crm.model.Customer;
import com.dumi.crm.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/customer")
@RequiredArgsConstructor
public class CustomerController {
    private final CustomerService customerService;

    @PostMapping("/add")
    public void addCustomer(@RequestBody Customer customer){
        customerService.addCustomer(customer);
    }

    @DeleteMapping("/customer-delete-by-id/{id}")
    public ResponseEntity<String> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.ok("Customer deleted successfully");
    }

    @PutMapping("/update-patient")
    public ResponseEntity<String> updateCustomer(@RequestBody Customer customer) {
        if (customerService.updateCustomer(customer)) {
            return ResponseEntity.ok("Customer updated successfully");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update customer. Please try again later.");
        }
    }

    @GetMapping("/customer-get-all")
    public List<Customer> getCustomer() {
        return customerService.getCustomer();
    }

    @GetMapping("/customer-search-by-id/{id}")
    public Customer searchCustomerById(@PathVariable Long id) {
        return customerService.findById(id);
    }

    @GetMapping("/Customer-search-by-name/{name}")
    public List<Customer> searchCustomerByName(@PathVariable String name){
        return customerService.getByName(name);
    }

    @GetMapping("/customer-search-by-nic/{nic}")
    public Customer searchCustomerByNic(@PathVariable String nic){
        return customerService.getByNic(nic);
    }

}
