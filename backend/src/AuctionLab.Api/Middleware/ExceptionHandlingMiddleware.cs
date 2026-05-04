using AuctionLab.Application.Auctions.Exceptions;
using AuctionLab.Application.Auth.Exceptions;
using AuctionLab.Application.Users.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace AuctionLab.Api.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;

    public ExceptionHandlingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch(Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception ex)
    {
        var statusCode = ex switch
        {
            DuplicateEmailException => StatusCodes.Status409Conflict,
            DuplicateUserNameException => StatusCodes.Status409Conflict,
            InvalidCredentialsException => StatusCodes.Status401Unauthorized,
            InvalidCurrentPasswordException => StatusCodes.Status401Unauthorized,
            UserNotFoundException => StatusCodes.Status401Unauthorized,
            AuctionNotFoundException => StatusCodes.Status404NotFound,
            ForbiddenException => StatusCodes.Status403Forbidden,
            InvalidAuctionEndtimeException => StatusCodes.Status400BadRequest,
            _ => StatusCodes.Status500InternalServerError
        };

        var problem = new ProblemDetails
        {
            Status = statusCode,
            Title = statusCode switch
            {
                409 => "Conflict",
                404 => "Not Found",
                403 => "Forbidden",
                401 => "Unauthorized",
                400 => "Bad Request",
                _ => "An unexpected error occurred"
            },
            Detail = ex.Message
        };

        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/problem+json";
        return context.Response.WriteAsJsonAsync(problem);
    }
}
