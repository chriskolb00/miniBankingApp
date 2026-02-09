using SampeDemoApi.Dtos;

namespace SampeDemoApi.Services;

public interface ICustomerService
{
    Task<IEnumerable<CustomerDto>> GetAllAsync();
    Task<CustomerDto?> GetByIdAsync(int id);
    Task<CustomerDto> CreateAsync(CreateCustomerDto dto);
    Task<bool> DeleteAsync(int id);
}
