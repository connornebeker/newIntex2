using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;

namespace Intex.Handlers
{
    public class RoleAuthorizationHandler : AuthorizationHandler<RoleBasedAuthorizationRequirement>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, RoleBasedAuthorizationRequirement requirement)
        {
            // Check if the user has the required role
            if (context.User.IsInRole(requirement.Role))
            {
                context.Succeed(requirement);
            }

            return Task.CompletedTask;
        }
    }
}
