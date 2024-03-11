using System.Security.Cryptography.Xml;
using System.Text;
using System.Text.Json;
    using API.Data;
    using API.Entities;
    using API.Middleware;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

    // Add services to the container.!

    builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    });

    // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen(c => {
        var jwtSecurityScheme = new OpenApiSecurityScheme{
            BearerFormat = "JWT",
            Name = "Authorization",
            In = ParameterLocation.Header,
            Type = SecuritySchemeType.ApiKey,
            Scheme = JwtBearerDefaults.AuthenticationScheme,
            Description = "Put Bearer + Your Token here",
            Reference = new OpenApiReference{
                Id = JwtBearerDefaults.AuthenticationScheme,
                Type = ReferenceType.SecurityScheme
            }
        };

        c.AddSecurityDefinition(jwtSecurityScheme.Reference.Id, jwtSecurityScheme);
        c.AddSecurityRequirement(new OpenApiSecurityRequirement {
            { 
                jwtSecurityScheme, Array.Empty<string>()
            }
        });
    });

    builder.Services.AddIdentityCore<User>(opt => {
        opt.User.RequireUniqueEmail = true;
    })
    .AddRoles<Role>()
    .AddEntityFrameworkStores<StoreContext>();

    builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt => {
        opt.TokenValidationParameters = new TokenValidationParameters{
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWTSettings:TokenKey"]))
        };
    });
    builder.Services.AddAuthorization();
    builder.Services.AddScoped<TokenService>();

    builder.Services.AddDbContext<StoreContext>(opt => 
    {
        opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
    });

    var app = builder.Build();

    app.UseMiddleware<ExceptionMiddleware>();

    // Configure the HTTP request pipeline.
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI(c => {
            c.ConfigObject.AdditionalItems.Add("persistAuthorization", "true");
        });
    }

    app.UseCors(opt => 
    {
        opt.AllowAnyHeader().AllowCredentials().AllowAnyMethod().WithOrigins("http://localhost:3000")
        .WithExposedHeaders("Pagination");
    });

    app.UseAuthorization();

    app.MapControllers();

    var scope = app.Services.CreateScope();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
    var context = scope.ServiceProvider.GetRequiredService<StoreContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

    try
    {
        await context.Database.MigrateAsync();
        await DbInitializer.Initialize(context, userManager);
    }
    catch(Exception ex)
    {
        logger.LogError(ex, "A problem occurred during migration");
    }

    app.Run();
