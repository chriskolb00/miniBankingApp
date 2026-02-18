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
    // Production: Use PostgreSQL (from Render or other provider)
    Console.WriteLine("🗄️  Using PostgreSQL database");
    
    // Handle both URI format (postgresql://) and connection string format (Host=...)
    if (connectionString.StartsWith("postgresql://") || connectionString.StartsWith("postgres://"))
    {
        // Convert PostgreSQL URI to Npgsql connection string format
        var uri = new Uri(connectionString);
        var host = uri.Host;
        var port = uri.Port > 0 ? uri.Port : 5432;
        var database = uri.AbsolutePath.Trim('/');
        var userInfo = uri.UserInfo.Split(':');
        var username = userInfo[0];
        var password = userInfo.Length > 1 ? userInfo[1] : "";
        
        connectionString = $"Host={host};Port={port};Database={database};Username={username};Password={password};SSL Mode=Require;Trust Server Certificate=true";
        Console.WriteLine($"📡 Connected to: {host}/{database}");
    }
    else
    {
        Console.WriteLine($"📡 Host: {connectionString.Split(';')[0].Replace("Host=", "")}");
    }
    
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

// Automatically apply migrations and ensure database is created
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        Console.WriteLine("📦 Ensuring database is created and migrations are applied...");
        context.Database.Migrate(); // This creates DB if not exists and applies all migrations
        Console.WriteLine("✅ Database is ready!");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Error initializing database: {ex.Message}");
        Console.WriteLine($"Stack trace: {ex.StackTrace}");
    }
}

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
// Enable Swagger in all environments (useful for testing on Render)
app.UseSwagger();
app.UseSwaggerUI();

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
