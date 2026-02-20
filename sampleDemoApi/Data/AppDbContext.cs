using Microsoft.EntityFrameworkCore;
using SampeDemoApi.Models;

namespace SampeDemoApi.Data;

public class AppDbContext : DbContext
{
    public DbSet<Account> Accounts => Set<Account>();
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<Transaction> Transactions => Set<Transaction>();

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure identity columns for PostgreSQL
        modelBuilder.Entity<Customer>()
            .Property(c => c.Id)
            .UseIdentityAlwaysColumn();

        modelBuilder.Entity<Account>()
            .Property(a => a.Id)
            .UseIdentityAlwaysColumn();

        modelBuilder.Entity<Transaction>()
            .Property(t => t.Id)
            .UseIdentityAlwaysColumn();

        // Configure Customer -> Account relationship
        modelBuilder.Entity<Customer>()
            .HasMany(c => c.Accounts)
            .WithOne(a => a.Customer)
            .HasForeignKey(a => a.CustomerId)
            .OnDelete(DeleteBehavior.Cascade);

        // Configure Account -> Transaction relationship
        modelBuilder.Entity<Account>()
            .HasMany(a => a.Transactions)
            .WithOne(t => t.Account)
            .HasForeignKey(t => t.AccountId)
            .OnDelete(DeleteBehavior.Cascade);

        // Configure decimal precision for money fields
        modelBuilder.Entity<Account>()
            .Property(a => a.Balance)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Transaction>()
            .Property(t => t.Amount)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Transaction>()
            .Property(t => t.BalanceBefore)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Transaction>()
            .Property(t => t.BalanceAfter)
            .HasPrecision(18, 2);
    }
}
