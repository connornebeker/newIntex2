using System.Security.Claims;
using Intex.Data;
using Intex.Handlers;
using Intex.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Swagger setup for API documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register HTTP client for external services
builder.Services.AddHttpClient();

// Register the application DbContexts
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("IdentityConnection")));

builder.Services.AddDbContext<MovieDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("MovieConnection")));

builder.Services.AddDbContext<UserRecDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("UserRecConnection")));

builder.Services.AddDbContext<UserLikedDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("UserLikedConnection")));

builder.Services.AddDbContext<MovieRecDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("MovieRecConnection")));

// Authorization setup
builder.Services.AddAuthorization();

// Register Identity services with custom options
builder.Services.AddIdentity<IdentityUser, IdentityRole>(options =>
{
    // Password requirements
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireNonAlphanumeric = false;  // At least one special character
    options.Password.RequiredLength = 13;  // Minimum length of 13 characters
    options.Password.RequiredUniqueChars = 0;  // At least 0 unique characters

    // Lockout settings (optional)
    options.Lockout.AllowedForNewUsers = true;
    options.Lockout.MaxFailedAccessAttempts = 50; // Max failed attempts before lockout
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15); // Time lockout lasts)
})
    //.AddEntityFrameworkStores<ApplicationDbContext>();)
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

//builder.Services.AddIdentityApiEndpoints<IdentityUser>(options =>
//{
//    // Password requirements
//    options.Password.RequireDigit = false;
//    options.Password.RequireLowercase = false;
//    options.Password.RequireUppercase = false;
//    options.Password.RequireNonAlphanumeric = false;  // At least one special character
//    options.Password.RequiredLength = 13;  // Minimum length of 13 characters
//    options.Password.RequiredUniqueChars = 0;  // At least 0 unique characters

//    // Lockout settings (optional)
//    options.Lockout.AllowedForNewUsers = true;
//    options.Lockout.MaxFailedAccessAttempts = 50; // Max failed attempts before lockout
//    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15); // Time lockout lasts)
//})
//    .AddEntityFrameworkStores<ApplicationDbContext>();

// Configure identity options
builder.Services.Configure<IdentityOptions>(options =>
{
    options.ClaimsIdentity.UserIdClaimType = ClaimTypes.NameIdentifier;
    options.ClaimsIdentity.UserNameClaimType = ClaimTypes.Email; // Use email for username claim
});

// Register custom UserClaimsPrincipalFactory for adding additional claims
builder.Services.AddScoped<IUserClaimsPrincipalFactory<IdentityUser>, CustomUserClaimsPrincipalFactory>();

// Configure authentication cookie options
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.None;
    options.Cookie.Name = ".AspNetCore.Identity.Application";
    options.LoginPath = "/login";
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
});

// CORS configuration for allowing frontend communication
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000") // Replace with your frontend URL
                .AllowCredentials() // Allow credentials (cookies)
                .AllowAnyMethod()
                .AllowAnyHeader();
        });
});

// Register a no-op email sender for identity (can be replaced with real sender if needed)
builder.Services.AddSingleton<IEmailSender<IdentityUser>, NoOpEmailSender<IdentityUser>>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Enable CORS policy
app.UseCors("AllowFrontend");

// HTTPS redirection
app.UseHttpsRedirection();

// Authentication and Authorization middleware
app.UseAuthentication();
app.UseAuthorization();

// Register controllers
app.MapControllers();
app.MapIdentityApi<IdentityUser>();

// Custom logout endpoint
app.MapPost("/logout", async (HttpContext context, SignInManager<IdentityUser> signInManager) =>
{
    await signInManager.SignOutAsync();

    // Remove authentication cookie on logout
    context.Response.Cookies.Delete(".AspNetCore.Identity.Application", new CookieOptions
    {
        HttpOnly = true,
        Secure = true,
        SameSite = SameSiteMode.None
    });

    return Results.Ok(new { message = "Logout successful" });
}).RequireAuthorization();

// Custom ping/auth check endpoint
app.MapGet("/pingauth", (ClaimsPrincipal user) =>
{
    if (!user.Identity?.IsAuthenticated ?? false)
    {
        return Results.Unauthorized();
    }

    var email = user.FindFirstValue(ClaimTypes.Email) ?? "unknown@example.com";
    return Results.Json(new { email = email });
}).RequireAuthorization();

app.Run();



//using System.Security.Claims;
//using Intex.Data;
//using Intex.Handlers;
//using Intex.Services;
//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Identity;
//using Microsoft.EntityFrameworkCore;

//var builder = WebApplication.CreateBuilder(args);

//// Add services to the container.

//builder.Services.AddControllers();
//// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
//builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();

////For the poster getting
//builder.Services.AddHttpClient();

//builder.Services.AddDbContext<ApplicationDbContext>(options =>
//    options.UseSqlServer(builder.Configuration.GetConnectionString("IdentityConnection")));

//builder.Services.AddDbContext<MovieDbContext>(options =>
//    options.UseSqlServer(builder.Configuration.GetConnectionString("MovieConnection") /*, sqlOptions => sqlOptions.EnableRetryOnFailure()*/));

//builder.Services.AddDbContext<UserRecDbContext>(options =>
//    options.UseSqlite(builder.Configuration.GetConnectionString("UserRecConnection")));

//builder.Services.AddDbContext<UserLikedDbContext>(options =>
//    options.UseSqlite(builder.Configuration.GetConnectionString("UserLikedConnection")));

//builder.Services.AddDbContext<MovieRecDbContext>(options =>
//    options.UseSqlite(builder.Configuration.GetConnectionString("MovieRecConnection")));

//builder.Services.AddAuthorization();

//builder.Services.AddIdentity<IdentityUser, IdentityRole>()
//    .AddEntityFrameworkStores<ApplicationDbContext>()
//    .AddDefaultTokenProviders();
////builder.Services.AddIdentityApiEndpoints<IdentityUser>(options =>
////{
////    // Password requirements
////    options.Password.RequireDigit = false;
////    options.Password.RequireLowercase = false;
////    options.Password.RequireUppercase = false;
////    options.Password.RequireNonAlphanumeric = false;  // At least one special character
////    options.Password.RequiredLength = 13;  // Minimum length of 13 characters
////    options.Password.RequiredUniqueChars = 0;  // At least 0 unique characters

////    // Lockout settings (optional)
////    options.Lockout.AllowedForNewUsers = true;
////    options.Lockout.MaxFailedAccessAttempts = 50; // Max failed attempts before lockout
////    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15); // Time lockout lasts)
////})
////    .AddEntityFrameworkStores<ApplicationDbContext>();


//builder.Services.Configure<IdentityOptions>(options =>
//{
//    options.ClaimsIdentity.UserIdClaimType = ClaimTypes.NameIdentifier;
//    options.ClaimsIdentity.UserNameClaimType = ClaimTypes.Email; // Ensure email is stored in claims
//});

//builder.Services.AddScoped<IUserClaimsPrincipalFactory<IdentityUser>, CustomUserClaimsPrincipalFactory>();


//builder.Services.ConfigureApplicationCookie(options =>
//{
//    options.Cookie.HttpOnly = true;
//    options.Cookie.SameSite = SameSiteMode.None;
//    options.Cookie.Name = ".AspNetCore.Identity.Application";
//    options.LoginPath = "/login";
//    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
//});

//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("AllowFrontend",
//        policy =>
//        {
//            policy.WithOrigins("http://localhost:3000") // Replace with your frontend URL
//                .AllowCredentials() // Required to allow cookies
//                .AllowAnyMethod()
//                .AllowAnyHeader();
//        });
//});

////// enable HTTPS redirection
////builder.Services.AddHttpsRedirection(options => {
////    options.HttpsPort = 443; // Set the HTTPS port to 443
////});

//builder.Services.AddSingleton<IEmailSender<IdentityUser>, NoOpEmailSender<IdentityUser>>();

//var app = builder.Build();

//// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}

//app.UseCors("AllowFrontend");
//app.UseHttpsRedirection();

//app.UseAuthentication();
//app.UseAuthorization();

//app.MapControllers();
//app.MapIdentityApi<IdentityUser>();

//app.MapPost("/logout", async (HttpContext context, SignInManager<IdentityUser> signInManager) =>
//{
//    await signInManager.SignOutAsync();

//    // Ensure authentication cookie is removed
//    context.Response.Cookies.Delete(".AspNetCore.Identity.Application", new CookieOptions
//    {
//        HttpOnly = true,
//        Secure = true,
//        SameSite = SameSiteMode.None
//    });

//    return Results.Ok(new { message = "Logout successful" });
//}).RequireAuthorization();


//app.MapGet("/pingauth", (ClaimsPrincipal user) =>
//{
//    if (!user.Identity?.IsAuthenticated ?? false)
//    {
//        return Results.Unauthorized();
//    }

//    var email = user.FindFirstValue(ClaimTypes.Email) ?? "unknown@example.com"; // Ensure it's never null
//    return Results.Json(new { email = email }); // Return as JSON
//}).RequireAuthorization();

//app.Run();
