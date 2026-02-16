using Microsoft.EntityFrameworkCore;
using SampeDemoApi.Data;
using SampeDemoApi.Middleware;
using SampeDemoApi.Services;

var builder = WebApplication.CreateBuilder(args);

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IAccountService, AccountService>();
builder.Services.AddScoped<ICustomerService, CustomerService>();
builder.Services.AddScoped<ITransactionService, TransactionService>();

// Database configuration - uses PostgreSQL in production, SQLite in development
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

if (!string.IsNullOrEmpty(connectionString))
{
    // Production: Use PostgreSQL (from Supabase or other provider)
    Console.WriteLine("🗄️  Using PostgreSQL (Supabase) database");
    Console.WriteLine($"📡 Host: {connectionString.Split(';')[0].Replace("Host=", "")}");
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseNpgsql(connectionString));
}
else
{
    // Development: Use SQLite
    Console.WriteLine("🗄️  Using SQLite local database (mini-bank.db)");
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseSqlite("Data Source=mini-bank.db"));
}

var app = builder.Build();

// Health check endpoint to verify database connection
app.MapGet("/api/health", (AppDbContext db) =>
{
    var dbProvider = db.Database.ProviderName;
    var isPostgres = dbProvider?.Contains("Npgsql") ?? false;
    
    return Results.Ok(new
    {
        Status = "Healthy",
        Database = isPostgres ? "PostgreSQL (Supabase)" : "SQLite",
        Provider = dbProvider,
        Environment = app.Environment.EnvironmentName,
        Timestamp = DateTime.UtcNow
    });
});

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Enable CORS
app.UseCors("AllowAll");

if (app.Urls.Any(url => url.StartsWith("https")))
{
    app.UseHttpsRedirection();
}
app.UseMiddleware<ExceptionMiddleware>();

app.MapControllers();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
