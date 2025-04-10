using Microsoft.EntityFrameworkCore;

namespace Intex.Data
{
    public class MovieDbContext : DbContext
    {
        public MovieDbContext(DbContextOptions<MovieDbContext> options)
            : base(options)
        {
        }

        public DbSet<movies_rating> movies_ratings { get; set; }
        public DbSet<movies_user> movies_users { get; set; }
        public DbSet<movie_title> movies_titles { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure composite primary key for MoviesRating
            modelBuilder.Entity<movies_rating>()
                .HasKey(mr => new { mr.user_id, mr.show_id });  // Composite primary key

            // Configure the relationship between MoviesRating and MoviesUser
            modelBuilder.Entity<movies_rating>()
                .HasOne(mr => mr.movies_user)  // Navigation property for user
                .WithMany(mu => (IEnumerable<movies_rating>)mu.movies_ratings)  // Each MoviesUser can have many MoviesRatings
                .HasForeignKey(mr => mr.user_id);  // Foreign key on UserId

            // Configure the relationship between MoviesRating and MoviesTitle
            modelBuilder.Entity<movies_rating>()
                .HasOne(mr => mr.movie_title)  // Navigation property for show
                .WithMany(mt => mt.movies_ratings)  // Each MoviesTitle can have many MoviesRatings
                .HasForeignKey(mr => mr.show_id);  // Foreign key on ShowId
        }
    }
}


