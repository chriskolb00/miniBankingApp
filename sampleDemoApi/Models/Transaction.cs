namespace SampeDemoApi.Models;

public class Transaction
{
    public int Id { get; set; }
    public int AccountId { get; set; }
    public TransactionType Type { get; set; }
    public decimal Amount { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal BalanceBefore { get; set; }
    public decimal BalanceAfter { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    
    // Navigation property
    public Account Account { get; set; } = null!;
}

public enum TransactionType
{
    Deposit,
    Withdrawal,
    Transfer
}
