namespace SampeDemoApi.Models;

public class Account
{
    public int Id { get; set; }
    public string AccountNumber { get; set; } = string.Empty;
    public decimal Balance { get; set; }
    public string OwnerName { get; set; } = string.Empty;
    
    // Foreign key
    public int CustomerId { get; set; }
    
    // Navigation properties
    public Customer Customer { get; set; } = null!;
    public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
}