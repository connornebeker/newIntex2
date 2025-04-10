using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.Build.ObjectModelRemoting;

namespace Intex.Data
{
    public class movie_title
    {
        internal object movies_ratings;
        [Key]
        [Required]
        public string show_id { get; set; }
        public string type { get; set; }
        public string title { get; set; }
        public string? director { get; set; }
        public string? cast { get; set; }
        public string? country { get; set; }
        public int release_year { get; set; }
        public string? rating { get; set; }
        public string? duration { get; set; }
        public string description { get; set; }
        public int Action { get; set; }
        public int Adventure { get; set; }
        [Column("Anime Series International TV Shows")]
        public int AnimeSeriesInternationalTVShows { get; set; }
        [Column("British TV Shows Docuseries International TV Shows")]
        public int BritishTVShowsDocuseriesInternationalTVShows { get; set; }
        public int Children { get; set; }
        public int Comedies { get; set; }
        [Column("Comedies Dramas International Movies")]
        public int ComediesDramasInternationalMovies { get; set; }
        [Column("Comedies International Movies")]
        public int ComediesInternationalMovies { get; set; }
        [Column("Comedies Romantic Movies")]
        public int ComediesRomanticMovies { get; set; }
        [Column("Crime TV Shows Docuseries")]
        public int CrimeTVShowsDocuseries { get; set; }
        public int Documentaries { get; set; }
        [Column("Documentaries International Movies")]
        public int DocumentariesInternationalMovies { get; set; }
        public int Docuseries { get; set; }

        public int Dramas { get; set; }        
        
        [Column("Dramas International Movies")]
        public int DramasInternationalMovies { get; set; }
        [Column("Dramas Romantic Movies")]
        public int DramasRomanticMovies { get; set; }
        [Column("Family Movies")]
        public int FamilyMovies { get; set; }
        public int Fantasy { get; set; }
        [Column("Horror Movies")]
        public int HorrorMovies { get; set; }
        [Column("International Movies Thrillers")]
        public int InternationalMoviesThrillers { get; set; }
        [Column("International TV Shows Romantic TV Shows TV Dramas")]
        public int InternationalTVShowsRomanticTVShowsTVDramas { get; set; }
        [Column("Kids'' TV")]
        public int KidsTV { get; set; }
        [Column("Language TV Shows")]
        public int LanguageTVShows { get; set; }
        public int Musicals { get; set; }
        [Column("Nature TV")]
        public int NatureTV { get; set; }
        [Column("Reality TV")]
        public int RealityTV { get; set; }
        public int Spirituality { get; set; }
        [Column("TV Action")]
        public int TVAction { get; set; }
        [Column("TV Comedies")]
        public int TVComedies { get; set; }
        [Column("TV Dramas")]
        public int TVDramas { get; set; }
        [Column("Talk Shows TV Comedies")]
        public int TalkShowsTVComedies { get; set; }
        public int Thrillers { get; set; }

        //public ICollection<movies_rating> movies_ratings { get; set; }
    }
}
