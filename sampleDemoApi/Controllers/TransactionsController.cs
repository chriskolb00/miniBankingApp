using Microsoft.AspNetCore.Mvc;
using SampeDemoApi.Dtos;
using SampeDemoApi.Services;

namespace SampeDemoApi.Controllers;

[ApiController]
[Route("api/transactions")]
public class TransactionsController : ControllerBase
{
    private readonly ITransactionService _service;
    
    public TransactionsController(ITransactionService service) 
    {
        _service = service;
    }

    // GET: api/transactions
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var transactions = await _service.GetAllAsync();
        return Ok(transactions);
    }

    // GET: api/transactions/1
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var transaction = await _service.GetByIdAsync(id);
        if (transaction == null)
            return NotFound();

        return Ok(transaction);
    }

    // GET: api/transactions/account/1
    [HttpGet("account/{accountId}")]
    public async Task<IActionResult> GetByAccountId(int accountId)
    {
        var transactions = await _service.GetByAccountIdAsync(accountId);
        return Ok(transactions);
    }

    // POST: api/transactions
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTransactionDto dto)
    {
        var created = await _service.CreateAsync(dto);

        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }
}
