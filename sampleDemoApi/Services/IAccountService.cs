using SampeDemoApi.Dtos;

namespace SampeDemoApi.Services;

public interface IAccountService
{
    Task<IEnumerable<AccountDto>> GetAllAsync();
    Task<AccountDto?> GetByIdAsync(int id);
    Task<AccountDto> CreateAsync(CreateAccountDto dto);
}
