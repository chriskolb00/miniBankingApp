using Microsoft.AspNetCore.Mvc;
using SampeDemoApi.Dtos;
using SampeDemoApi.Services;

namespace SampeDemoApi.Controllers;

[ApiController]
[Route("api/accounts")]
public class AccountsController : ControllerBase
{
    private readonly IAccountService _service;
    
    public AccountsController(IAccountService service) 
    {
        _service = service;
    }

    // GET: api/accounts
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var accounts = await _service.GetAllAsync();
        return Ok(accounts);
    }

    // GET: api/accounts/1
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var account = await _service.GetByIdAsync(id);
        if (account == null)
            return NotFound();

        return Ok(account);
    }

    // POST: api/accounts
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateAccountDto dto)
    {
        var created = await _service.CreateAsync(dto);

        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }
}