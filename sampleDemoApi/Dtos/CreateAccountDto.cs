using System.ComponentModel.DataAnnotations;

namespace SampeDemoApi.Dtos;

public class CreateAccountDto
{
    [Required]
    public int CustomerId { get; set; }

    [Required]
    [MinLength(6)]
    public string AccountNumber { get; set; } = string.Empty;

    [Range(0, double.MaxValue)]
    public decimal Balance { get; set; }

    [Required]
    public string OwnerName { get; set; } = string.Empty;
}
