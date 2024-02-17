using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;
        private readonly IHostEnvironment _env;
        public ExceptionMiddleware(RequestDelegate next, 
        ILogger<ExceptionMiddleware> logger,
        IHostEnvironment env)
        {   
            this._next = next;
            this._logger = logger;
            this._env = env;
        }

        public async Task InvokeAsync(HttpContext context){
            try{
                await _next(context);
            }
            catch(System.Exception ex){
                _logger.LogError(ex, ex.Message);

                context.Response.ContentType = "application/json";
                context.Response.StatusCode = 500;

                var response = new ProblemDetails{
                    Status = 500,
                    Detail = this._env.IsDevelopment() ? ex.StackTrace : null,
                    Title = ex.Message
                };

                var option = new JsonSerializerOptions{
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                };

                var json = JsonSerializer.Serialize(response, option);

                await context.Response.WriteAsync(json);

            }
        }
    }
}