using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Intex.Data;

public class User_Liked_Recommendation
{
    [Key]
    public string index { get; set; }
    [Column("if you watched")] 
    public string liked { get; set; }
    [Column("Recommendation 1")]
    public string Recommendation1 { get; set; }
    [Column("Recommendation 2")]
    public string Recommendation2 { get; set; }
    [Column("Recommendation 3")]
    public string Recommendation3 { get; set; }
    [Column("Recommendation 4")]
    public string Recommendation4 { get; set; }
    [Column("Recommendation 5")]
    public string Recommendation5 { get; set; }
    [Column("Recommendation 6")]
    public string Recommendation6 { get; set; }
    [Column("Recommendation 7")]
    public string Recommendation7 { get; set; }
    [Column("Recommendation 8")]
    public string Recommendation8 { get; set; }
    [Column("Recommendation 9")]
    public string Recommendation9 { get; set; }
    [Column("Recommendation 10")]
    public string Recommendation10 { get; set; }
}