using Microsoft.EntityFrameworkCore;

namespace Intex.Data
{
    public class IdentityDbContext : DbContext
    {
        public IdentityDbContext(DbContextOptions<IdentityDbContext> options)
            : base(options)
        {
        }
        public DbSet<AspNetUser> AspNetUsers { get; set; }
    }
}
