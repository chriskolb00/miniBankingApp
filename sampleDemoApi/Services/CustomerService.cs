using Microsoft.EntityFrameworkCore;
using SampeDemoApi.Data;
using SampeDemoApi.Dtos;
using SampeDemoApi.Models;

namespace SampeDemoApi.Services;

public class CustomerService : ICustomerService
{
    private readonly ILogger<CustomerService> _logger;
    private readonly AppDbContext _context;

    public CustomerService(AppDbContext context, ILogger<CustomerService> logger)
    {
        _logger = logger;
        _context = context;
    }

    public async Task<IEnumerable<CustomerDto>> GetAllAsync()
    {
        _logger.LogInformation("Fetching all customers from database");
        
        var customers = await _context.Customers.ToListAsync();
        
        _logger.LogInformation("Fetched {Count} customers", customers.Count);
        
        return customers.Select(MapToDto);
    }

    public async Task<CustomerDto?> GetByIdAsync(int id)
    {
        _logger.LogInformation("Fetching customer by id. Id={Id}", id);

        var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Id == id);
        
        if (customer == null)
        {
            _logger.LogWarning("Customer not found. Id={Id}", id);
            return null;
        }
        
        return MapToDto(customer);
    }

    public async Task<CustomerDto> CreateAsync(CreateCustomerDto dto)
    {
        _logger.LogInformation(
            "Creating customer: {FirstName} {LastName}, Email={Email}",
            dto.FirstName, dto.LastName, dto.Email
        );

        var existingCustomer = await _context.Customers
            .FirstOrDefaultAsync(c => c.Email == dto.Email);
            
        if (existingCustomer != null)
        {
            _logger.LogWarning("Duplicate email attempt. Email={Email}", dto.Email);
            throw new InvalidOperationException("Customer with this email already exists.");
        }

        var customer = new Customer
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Email = dto.Email,
            Phone = dto.Phone,
            Address = dto.Address,
            DateOfBirth = dto.DateOfBirth,
            CreatedAt = DateTime.UtcNow
        };

        _context.Customers.Add(customer);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Customer created. Id={Id}, Email={Email}", customer.Id, customer.Email);

        return MapToDto(customer);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        _logger.LogInformation("Deleting customer. Id={Id}", id);

        var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Id == id);
        
        if (customer == null)
        {
            _logger.LogWarning("Customer not found for deletion. Id={Id}", id);
            return false;
        }

        _context.Customers.Remove(customer);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Customer deleted. Id={Id}", id);
        
        return true;
    }

    private static CustomerDto MapToDto(Customer customer)
    {
        return new CustomerDto
        {
            Id = customer.Id,
            FirstName = customer.FirstName,
            LastName = customer.LastName,
            Email = customer.Email,
            Phone = customer.Phone,
            Address = customer.Address,
            DateOfBirth = customer.DateOfBirth,
            CreatedAt = customer.CreatedAt
        };
    }
}
