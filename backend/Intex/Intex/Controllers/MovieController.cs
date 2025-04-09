using System.Text.RegularExpressions;
using Intex.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Intex.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MovieController : ControllerBase
    {
        private readonly MovieRecDbContext _movieContext;
        private readonly UserRecDbContext _userContext;
        private readonly UserLikedDbContext _userLikedContext;
        private readonly MovieDbContext _savedMovieContext;
        private readonly IdentityDbContext _identityContext;

        public MovieController(
            MovieRecDbContext movieTemp,
            UserRecDbContext userTemp,
            UserLikedDbContext userLikedTemp,
            MovieDbContext savedMovieTemp,
            IdentityDbContext identityContext)
        {
            _movieContext = movieTemp;
            _userContext = userTemp;
            _userLikedContext = userLikedTemp;
            _savedMovieContext = savedMovieTemp;
            _identityContext = identityContext;
        }

        [HttpGet("UserRec")]
        public IActionResult UserRec(string userName)
        {
            // Step 1: Get the recommendations for this user
            var userEmail = _identityContext.AspNetUsers
                .Where(ur => ur.UserName == userName)
                .Select(u => u.UserName)
                .FirstOrDefault();

            var intUserId = _savedMovieContext.MoviesUsers
                .Where(u => u.email == userEmail)
                .Select(u => u.user_id)
                .FirstOrDefault();

            var userRec = _userContext.User_Recommendations
                .FirstOrDefault(u => u.User == intUserId);

            // Step 2: Gather the recommended titles into a list
            var recommendedTitles = new List<string>
            {
                userRec.Recommendation1,
                userRec.Recommendation2,
                userRec.Recommendation3,
                userRec.Recommendation4,
                userRec.Recommendation5,
                userRec.Recommendation6,
                userRec.Recommendation7,
                userRec.Recommendation8,
                userRec.Recommendation9,
                userRec.Recommendation10
            };

            // Step 3: Query the movie table to get full info on those titles
            var recommendedMovies = _savedMovieContext.movies_titles
                .Where(m => recommendedTitles.Contains(m.title))
                .ToList();

            return Ok(recommendedMovies);
        }


        [HttpGet("MovieRec")]
        public IActionResult MovieRec(string title)
        {
            
            if (string.IsNullOrEmpty(title))
            {
                return BadRequest("Title must be provided.");
            }
            
            // Step 1: Get top 10 recommended titles for the given movie
            var recs = _movieContext.Movie_Recommendations
                .Where(mr => mr.original_title == title)
                .OrderByDescending(mr => mr.similarity_score)
                .Take(5)
                .ToList();

            if (!recs.Any())
            {
                return NotFound("No recommendations found for this title.");
            }

            // Step 2: Extract the recommended titles
            var recommendedTitles = recs.Select(r => r.recommended_title).ToList();

            // Step 3: Query the Movie_Titles table to get full info
            var recommendedMovies = _savedMovieContext.movies_titles
                .Where(m => recommendedTitles.Contains(m.title))
                .ToList();

            // Step 4: Return the movies in the expected format
            return Ok(new { movies = recommendedMovies });
        }

        [HttpGet("AllMovies")]
        public async Task<IActionResult> AllMovies([FromQuery] List<string>? movieTypes)
        {

            var query = _savedMovieContext.movies_titles.AsQueryable();

            if (movieTypes != null && movieTypes.Any())
            {
                query = query.Where(m => movieTypes.Contains(m.type));
            }

            var movieList = await query
                .AsNoTracking()
                .Take(100)
                .ToListAsync();

            return Ok(movieList);
        }


        [HttpGet("GetMovieTypes")]
      public IActionResult GetMovieTypes()
        {
    // Exclude "release-year"
    var excluded = new[] { "release_year" };

    // Define the custom order for the genres
    var customOrder = new[]
    {
        "Action",
        "Comedies",
        "Drama",
        "Thrillers",
        "Documentaries",
        "FamilyMovies",
        "Dramas",
        "Adventure",
        "HorrorMovies",
        "ComediesDramas",
        "ComediesRomanticMovies",
        "Fantasy",
        "CrimeTVShows",
        "DramasRomanticMovies",
        "RomanticMovies",
        "InternationalMovies",
        "Kids'TV",
        "AnimeSeriesInternationalTVShows",
        "RealityTV",
        "InternationalTVShows",
        "Musicals",
        "NatureTV",
        "TVAction",
        "ComediesInternationalMovies",
        "ComediesDramasInternationalMovies",
        "InternationalMoviesThrillers",
        "LanguageTVShows",
        "Spirituality",
        "TalkShowsTVComedies",
        "BritishTVShows DocuseriesInternationalTVShows",
        "TalkShows",
        "InternationalTVShowsRomanticTVShowsTVDramas",
        "CrimeTVShowsDocuseries",
        "DocumentariesInternationalMovies",
        "Docuseries",
        "Children"
    };

    // Create a dictionary for fast look-up to determine the order index of each genre
    var genreOrderDict = customOrder
        .Select((genre, index) => new { genre, index })
        .ToDictionary(x => x.genre, x => x.index);

    // Get the property names from the movie_title class
    var genreColumns = typeof(movie_title)
        .GetProperties()
        .Where(p => p.PropertyType == typeof(int) && !excluded.Contains(p.Name)) // assuming genre columns are int
        .Select(p => p.Name)
        .ToList();

    // Sort genre columns based on the custom order defined in genreOrderDict
    var orderedGenreColumns = genreColumns
        .Where(g => genreOrderDict.ContainsKey(g)) // Ensure that we only sort genres that exist in customOrder
        .OrderBy(g => genreOrderDict[g]) // Order by the index from the genreOrderDict
        .ToList();

    return Ok(orderedGenreColumns);
}


        [HttpGet("MovieDetails")]
        public IActionResult MovieDetails(string show_id)
        {
            var movie = _savedMovieContext.movies_titles
                .FirstOrDefault(m => m.title == show_id);

            if (movie == null)
            {
                return NotFound("Movie not found.");
            }

            return Ok(movie);
        }

        [HttpGet("GetMoviesByGenre")]
        public async Task<IActionResult> GetMoviesByGenre(string genre, int page = 1, int pageSize = 100)
        {
            if (string.IsNullOrEmpty(genre)) return BadRequest("Genre is required.");

            var skip = (page - 1) * pageSize;

            var movies = await _savedMovieContext.movies_titles
                .Where(m => EF.Property<int>(m, genre) == 1)
                .Skip(skip)
                .Take(pageSize)
                .AsNoTracking()
                .ToListAsync();

            return Ok(movies);
        }

    }
}
