using Microsoft.AspNetCore.Authorization;

namespace Intex.Handlers
{
    // Custom requirement to check if a user has a certain role
    public class RoleBasedAuthorizationRequirement : IAuthorizationRequirement
    {
        public string Role { get; }

        public RoleBasedAuthorizationRequirement(string role)
        {
            Role = role;
        }
    }
}

