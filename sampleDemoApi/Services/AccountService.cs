using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SampeDemoApi.Data;
using SampeDemoApi.Dtos;
using SampeDemoApi.Models;

namespace SampeDemoApi.Services;

public class AccountService : IAccountService
{
    private readonly ILogger<AccountService> _logger;
    private readonly AppDbContext _context;

    public AccountService(AppDbContext context, ILogger<AccountService> logger)
    {
        _logger = logger;
        _context = context;
    }

    public async Task<IEnumerable<AccountDto>> GetAllAsync()
    {
        _logger.LogInformation("Fetching all accounts from database");
        
        var accounts = await _context.Accounts.ToListAsync();
        
        _logger.LogInformation("Fetched {Count} accounts", accounts.Count);
        
        return accounts.Select(MapToDto);
    }

    public async Task<AccountDto?> GetByIdAsync(int id)
    {
        _logger.LogInformation("Fetching account by id. Id={Id}", id);

        var account = await _context.Accounts.FirstOrDefaultAsync(a => a.Id == id);
        
        if (account == null)
        {
            _logger.LogWarning("Account not found. Id={Id}", id);
            return null;
        }
        
        return MapToDto(account);
    }

    public async Task<AccountDto> CreateAsync(CreateAccountDto dto)
    {
        _logger.LogInformation(
            "Creating account for Owner={OwnerName}, AccountNumber={AccountNumber}, Balance={Balance}, CustomerId={CustomerId}",
            dto.OwnerName, dto.AccountNumber, dto.Balance, dto.CustomerId
        );

        var existingAccount = await _context.Accounts
            .FirstOrDefaultAsync(a => a.AccountNumber == dto.AccountNumber);
            
        if (existingAccount != null)
        {
            _logger.LogWarning("Duplicate account number attempt. AccountNumber={AccountNumber}", dto.AccountNumber);
            throw new InvalidOperationException("Account number already exists.");
        }

        // Verify customer exists
        var customerExists = await _context.Customers.AnyAsync(c => c.Id == dto.CustomerId);
        if (!customerExists)
        {
            _logger.LogWarning("Customer not found. CustomerId={CustomerId}", dto.CustomerId);
            throw new InvalidOperationException("Customer not found.");
        }

        var account = new Account
        {
            CustomerId = dto.CustomerId,
            AccountNumber = dto.AccountNumber,
            Balance = dto.Balance,
            OwnerName = dto.OwnerName
        };

        _context.Accounts.Add(account);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Account created. Id={Id}, AccountNumber={AccountNumber}", account.Id, account.AccountNumber);

        return MapToDto(account);
    }

    private static AccountDto MapToDto(Account account)
    {
        return new AccountDto
        {
            Id = account.Id,
            CustomerId = account.CustomerId,
            AccountNumber = account.AccountNumber,
            Balance = account.Balance,
            OwnerName = account.OwnerName
        };
    }
}
