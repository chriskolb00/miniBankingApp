namespace SampeDemoApi.Dtos;

public class AccountDto
{
    public int Id { get; set; }
    public int CustomerId { get; set; }
    public string AccountNumber { get; set; } = string.Empty;
    public decimal Balance { get; set; }
    public string OwnerName { get; set; } = string.Empty;
}
