using Microsoft.EntityFrameworkCore;
using SampeDemoApi.Data;
using SampeDemoApi.Dtos;
using SampeDemoApi.Models;

namespace SampeDemoApi.Services;

public class TransactionService : ITransactionService
{
    private readonly ILogger<TransactionService> _logger;
    private readonly AppDbContext _context;

    public TransactionService(AppDbContext context, ILogger<TransactionService> logger)
    {
        _logger = logger;
        _context = context;
    }

    public async Task<IEnumerable<TransactionDto>> GetAllAsync()
    {
        _logger.LogInformation("Fetching all transactions from database");
        
        var transactions = await _context.Transactions
            .OrderByDescending(t => t.Timestamp)
            .ToListAsync();
        
        _logger.LogInformation("Fetched {Count} transactions", transactions.Count);
        
        return transactions.Select(MapToDto);
    }

    public async Task<IEnumerable<TransactionDto>> GetByAccountIdAsync(int accountId)
    {
        _logger.LogInformation("Fetching transactions for account. AccountId={AccountId}", accountId);
        
        var transactions = await _context.Transactions
            .Where(t => t.AccountId == accountId)
            .OrderByDescending(t => t.Timestamp)
            .ToListAsync();
        
        _logger.LogInformation("Fetched {Count} transactions for account {AccountId}", transactions.Count, accountId);
        
        return transactions.Select(MapToDto);
    }

    public async Task<TransactionDto?> GetByIdAsync(int id)
    {
        _logger.LogInformation("Fetching transaction by id. Id={Id}", id);

        var transaction = await _context.Transactions.FirstOrDefaultAsync(t => t.Id == id);
        
        if (transaction == null)
        {
            _logger.LogWarning("Transaction not found. Id={Id}", id);
            return null;
        }
        
        return MapToDto(transaction);
    }

    public async Task<TransactionDto> CreateAsync(CreateTransactionDto dto)
    {
        _logger.LogInformation(
            "Creating transaction: Type={Type}, Amount={Amount}, AccountId={AccountId}",
            dto.Type, dto.Amount, dto.AccountId
        );

        // Get the account with lock to prevent race conditions
        var account = await _context.Accounts.FirstOrDefaultAsync(a => a.Id == dto.AccountId);
        
        if (account == null)
        {
            _logger.LogWarning("Account not found. AccountId={AccountId}", dto.AccountId);
            throw new InvalidOperationException("Account not found.");
        }

        var balanceBefore = account.Balance;
        var balanceAfter = balanceBefore;

        // Apply transaction logic
        switch (dto.Type)
        {
            case TransactionType.Deposit:
                balanceAfter = balanceBefore + dto.Amount;
                break;
            case TransactionType.Withdrawal:
                if (balanceBefore < dto.Amount)
                {
                    _logger.LogWarning("Insufficient funds. AccountId={AccountId}, Balance={Balance}, Amount={Amount}", 
                        dto.AccountId, balanceBefore, dto.Amount);
                    throw new InvalidOperationException("Insufficient funds.");
                }
                balanceAfter = balanceBefore - dto.Amount;
                break;
            case TransactionType.Transfer:
                if (balanceBefore < dto.Amount)
                {
                    _logger.LogWarning("Insufficient funds for transfer. AccountId={AccountId}, Balance={Balance}, Amount={Amount}", 
                        dto.AccountId, balanceBefore, dto.Amount);
                    throw new InvalidOperationException("Insufficient funds for transfer.");
                }
                balanceAfter = balanceBefore - dto.Amount;
                break;
        }

        var transaction = new Transaction
        {
            AccountId = dto.AccountId,
            Type = dto.Type,
            Amount = dto.Amount,
            Description = dto.Description,
            BalanceBefore = balanceBefore,
            BalanceAfter = balanceAfter,
            Timestamp = DateTime.UtcNow
        };

        // Update account balance
        account.Balance = balanceAfter;

        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();

        _logger.LogInformation(
            "Transaction created. Id={Id}, Type={Type}, Amount={Amount}, NewBalance={NewBalance}", 
            transaction.Id, transaction.Type, transaction.Amount, balanceAfter
        );

        return MapToDto(transaction);
    }

    private static TransactionDto MapToDto(Transaction transaction)
    {
        return new TransactionDto
        {
            Id = transaction.Id,
            AccountId = transaction.AccountId,
            Type = transaction.Type,
            Amount = transaction.Amount,
            Description = transaction.Description,
            BalanceBefore = transaction.BalanceBefore,
            BalanceAfter = transaction.BalanceAfter,
            Timestamp = transaction.Timestamp
        };
    }
}
