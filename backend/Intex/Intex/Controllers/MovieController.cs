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
    [Authorize]
    public class MovieController : ControllerBase
    {
        private readonly MovieRecDbContext _movieContext;
        private readonly UserRecDbContext _userContext;
        private readonly UserLikedDbContext _userLikedContext;
        private readonly MovieDbContext _savedMovieContext;

        public MovieController(
            MovieRecDbContext movieTemp,
            UserRecDbContext userTemp,
            UserLikedDbContext userLikedTemp,
            MovieDbContext savedMovieTemp)
        {
            _movieContext = movieTemp;
            _userContext = userTemp;
            _userLikedContext = userLikedTemp;
            _savedMovieContext = savedMovieTemp;
        }

        [HttpPost("loginStuff/{email}")]
        public IActionResult LoginStuff(string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest(new { message = "Email is required" });
            }
            return Ok(email);
        }

        [HttpGet("UserRec/{userName}")]
        public IActionResult UserRec(string userName)
        {
            // Step 1: Get the recommendations for this user
            var intUserId = _savedMovieContext.movies_users

                .Where(u => u.email == userName)
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

        
        [HttpGet("BecauseYouWatched/{userName}")]
        public IActionResult BecauseYouWatched(string userName)
        {

            // Step 2: Get internal user_id using their email
            var intUserId = _savedMovieContext.movies_users
                .Where(u => u.email == userName)
                .Select(u => u.user_id) // must match type of `index` in User_Liked_Recommendation
                .FirstOrDefault();

            if (intUserId == null)
                return NotFound("User not found in movie-user link table.");

            // Step 3: Get recommendation record for this user
            var liked = _userContext.User_Recommendations
                .Where(r => r.User == intUserId)
                .Select(l => l.LikedMovies)
                .FirstOrDefault();
            
            var likedTitles = liked.Split(',', StringSplitOptions.RemoveEmptyEntries)
                .Select(t => t.Trim())
                .ToList();

            if (!likedTitles.Any())
            {
                return NotFound("No liked movies found.");
            }

            var random = new Random();
            var randomTitle = likedTitles[random.Next(likedTitles.Count)];

            if (likedTitles == null)
                return NotFound("No 'because you watched' recommendations found for this user.");

            var rec = _userLikedContext.User_Liked_Recommendations
                .FirstOrDefault(r => r.liked == randomTitle);
            
            // Step 4: Build list of recommended titles
            var recommendedTitles = new List<string>
            {
                rec.Recommendation1, rec.Recommendation2, rec.Recommendation3,
                rec.Recommendation4, rec.Recommendation5, rec.Recommendation6,
                rec.Recommendation7, rec.Recommendation8, rec.Recommendation9, rec.Recommendation10
            };

            // Step 5: Get base movie and recommendations from movie_titles
            //var baseMovie = _savedMovieContext.movies_titles
            //    .FirstOrDefault(m => m.title == rec.liked);

            var recommendedMovies = _savedMovieContext.movies_titles
                .Where(m => recommendedTitles.Contains(m.title))
                .ToList();

            // Step 6: Return both
            return Ok(new
            {
                baseMovie = rec,
                recommended = recommendedMovies
            });
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

        [HttpPost("RateMovie")]
        public IActionResult RateMovie([FromBody] RateMovieRequest request)
        {
            if (string.IsNullOrEmpty(request.ShowId) || string.IsNullOrEmpty(request.UserName) || request.Rating < 1 || request.Rating > 5)
            {
                return BadRequest("Show ID and user name are required.");
            }

            var intUserId = _savedMovieContext.movies_users
                .Where(u => u.email == request.UserName)
                .Select(u => u.user_id)
                .FirstOrDefault();

            if (intUserId == 0)
            {
                return NotFound("User not found in movie-user link table.");
            }

            var movieRating = new movies_rating
            {
                user_id = intUserId,
                show_id = request.ShowId,
                rating = request.Rating
            };

            _savedMovieContext.movies_ratings.Add(movieRating);
            _savedMovieContext.SaveChanges();

            return Ok(new { message = "Movie rated successfully." });
        }
        
        [HttpGet("GetRating/{username}/{showId}")]
        public IActionResult GetUserRating(string username, string showId)
        {
            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(showId))
                return BadRequest("Username and show ID are required.");

            var intUserId = _savedMovieContext.movies_users
                .Where(u => u.email == username)
                .Select(u => u.user_id)
                .FirstOrDefault();

            if (intUserId == 0)
                return NotFound("User not found.");

            var rating = _savedMovieContext.movies_ratings
                .Where(r => r.user_id == intUserId && r.show_id == showId)
                .Select(r => r.rating)
                .FirstOrDefault();

            if (rating == 0)
                return Ok(null); // No rating yet

            return Ok(rating);
        }
        
        [HttpPut("UpdateRating")]
        public IActionResult UpdateRating([FromBody] RatingUpdateDto ratingUpdate)
        {
            if (string.IsNullOrEmpty(ratingUpdate.ShowId) ||
                string.IsNullOrEmpty(ratingUpdate.UserName) ||
                ratingUpdate.Rating < 1 || ratingUpdate.Rating > 5)
            {
                return BadRequest("Invalid data provided.");
            }

            // Get user ID from email/username
            var intUserId = _savedMovieContext.movies_users
                .Where(u => u.email == ratingUpdate.UserName)
                .Select(u => u.user_id)
                .FirstOrDefault();

            if (intUserId == 0)
            {
                return NotFound("User not found.");
            }

            // Find existing rating
            var existingRating = _savedMovieContext.movies_ratings
                .FirstOrDefault(r => r.user_id == intUserId && r.show_id == ratingUpdate.ShowId);

            if (existingRating == null)
            {
                return NotFound("Rating not found to update.");
            }

            // Update rating
            existingRating.rating = ratingUpdate.Rating;
            _savedMovieContext.SaveChanges();

            return Ok(new { message = "Rating updated successfully." });
        }


        [HttpGet("search")]
        public async Task<IActionResult> SearchMovies([FromQuery] string q, int page = 1, int pageSize = 20)
        {
            if (string.IsNullOrWhiteSpace(q))
                return BadRequest("Query is required.");

            // Fetch all movies matching the query
            var results = await _savedMovieContext.movies_titles
                .Where(m => m.title.ToLower().Contains(q.ToLower())) // Fetch movies matching the query
                .ToListAsync();

            // Calculate relevance score and order by it first
            var scoredResults = results.Select(m => new
            {
                m.show_id,
                m.type,
                m.title,
                m.director,
                m.cast,
                m.country,
                m.release_year,
                m.rating,
                m.duration,
                m.description,
                m.Action,
                m.Adventure,
                m.AnimeSeriesInternationalTVShows,
                m.BritishTVShowsDocuseriesInternationalTVShows,
                m.Children,
                m.Comedies,
                m.ComediesDramasInternationalMovies,
                m.ComediesInternationalMovies,
                m.ComediesRomanticMovies,
                m.CrimeTVShowsDocuseries,
                m.Documentaries,
                m.DocumentariesInternationalMovies,
                m.Docuseries,
                m.Dramas,
                m.DramasInternationalMovies,
                m.DramasRomanticMovies,
                m.FamilyMovies,
                m.Fantasy,
                m.HorrorMovies,
                m.InternationalMoviesThrillers,
                m.InternationalTVShowsRomanticTVShowsTVDramas,
                m.KidsTV,
                m.LanguageTVShows,
                m.Musicals,
                m.NatureTV,
                m.RealityTV,
                m.Spirituality,
                m.TVAction,
                m.TVComedies,
                m.TVDramas,
                m.TalkShowsTVComedies,
                m.Thrillers,
                Relevance = m.title.ToLower().Split(' ')
                    .Count(word => word.Contains(q.ToLower()))  // Count how many words match
            })
            .OrderByDescending(m => m.Relevance) // Sort by relevance score first
            .ToList();

            // Apply pagination (skip and take) after sorting by relevance
            var skip = (page - 1) * pageSize;
            var paginatedResults = scoredResults.Skip(skip).Take(pageSize).ToList();

            // Get the total count of results matching the query (for pagination purposes)
            var totalResults = scoredResults.Count;

            return Ok(new
            {
                totalResults,
                movies = paginatedResults
            });
        }



    }
}
