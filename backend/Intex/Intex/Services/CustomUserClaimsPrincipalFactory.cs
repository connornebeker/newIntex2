
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;

namespace Intex.Services
{
    public class CustomUserClaimsPrincipalFactory : UserClaimsPrincipalFactory<IdentityUser>
    {
        public CustomUserClaimsPrincipalFactory(
            UserManager<IdentityUser> userManager,
            IOptions<IdentityOptions> optionsAccessor)
            : base(userManager, optionsAccessor) { }

        protected override async Task<ClaimsIdentity> GenerateClaimsAsync(IdentityUser user)
        {
            var identity = await base.GenerateClaimsAsync(user);

            // Ensure the email claim is present
            identity.AddClaim(new Claim(ClaimTypes.Email, user.Email ?? ""));

            // Add roles to the claims
            var roles = await UserManager.GetRolesAsync(user);
            foreach (var role in roles)
            {
                identity.AddClaim(new Claim(ClaimTypes.Role, role));
            }

            return identity;
        }
    }
}




//using System.Security.Claims;
//using Microsoft.AspNetCore.Identity;
//using Microsoft.Extensions.Options;

//namespace Intex.Services;

//public class CustomUserClaimsPrincipalFactory : UserClaimsPrincipalFactory<IdentityUser>
//{
//    public CustomUserClaimsPrincipalFactory(
//        UserManager<IdentityUser> userManager,
//        IOptions<IdentityOptions> optionsAccessor)
//        : base(userManager, optionsAccessor) { }

//    protected override async Task<ClaimsIdentity> GenerateClaimsAsync(IdentityUser user)
//    {
//        var identity = await base.GenerateClaimsAsync(user);
//        identity.AddClaim(new Claim(ClaimTypes.Email, user.Email ?? "")); // Ensure email claim is always present
//        return identity;
//    }
//}