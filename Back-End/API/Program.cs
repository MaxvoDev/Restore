    using System.Text.Json;
    using API.Data;
    using API.Entities;
    using API.Middleware;
    using Microsoft.EntityFrameworkCore;

    var builder = WebApplication.CreateBuilder(args);

    // Add services to the container.!

    builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    });

    // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();

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
        app.UseSwaggerUI();
    }

    app.UseCors(opt => 
    {
        opt.AllowAnyHeader().AllowCredentials().AllowAnyMethod().WithOrigins("http://localhost:3000")
        .WithExposedHeaders("Pagination");
    });

    app.UseAuthorization();

    app.MapControllers();

    var scope = app.Services.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<StoreContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

    try
    {
        context.Database.Migrate();
        DbInitializer.Initialize(context);
    }
    catch(Exception ex)
    {
        logger.LogError(ex, "A problem occurred during migration");
    }

    app.Run();
