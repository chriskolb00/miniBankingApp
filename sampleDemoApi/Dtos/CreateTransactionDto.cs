using System.ComponentModel.DataAnnotations;
using SampeDemoApi.Models;

namespace SampeDemoApi.Dtos;

public class CreateTransactionDto
{
    [Required]
    public int AccountId { get; set; }

    [Required]
    public TransactionType Type { get; set; }

    [Required]
    [Range(0.01, double.MaxValue)]
    public decimal Amount { get; set; }

    public string Description { get; set; } = string.Empty;
}
