using System.Diagnostics;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers{
    public class AccountController : BaseApiController{
        private readonly UserManager<User> _userManager;
        private readonly TokenService _tokenService;
        private readonly StoreContext _storeContext;
        public AccountController(UserManager<User> userManager, TokenService tokenService, StoreContext storeContext)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _storeContext = storeContext;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto){
            var user = await _userManager.FindByNameAsync(loginDto.Username);
            var isCorrectPassword = await _userManager.CheckPasswordAsync(user, loginDto.Password);
            if(!isCorrectPassword) return Unauthorized();

            var userBasket = await RetrieveBasket(loginDto.Username);
            var anonBasket = await RetrieveBasket(Request.Cookies["buyerId"]);
            if( anonBasket != null ){
                if(userBasket != null)
                    _storeContext.Baskets.Remove(userBasket);
                anonBasket.BuyerId = user.UserName;
                Response.Cookies.Delete("buyerId");
                await _storeContext.SaveChangesAsync();  
                userBasket = anonBasket;             
            }

            return new UserDto{
                Email = user.Email,
                Token = await _tokenService.GenerateToken(user),
                Basket = userBasket?.MapToBasketDto() ?? null
            };
        }

        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(RegisterDto registerDto){
            var user = new User { UserName = registerDto.Username, Email = registerDto.Email };
            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if(!result.Succeeded){
                foreach(var error in result.Errors){
                    ModelState.AddModelError(error.Code, error.Description);
                    return ValidationProblem();
                }
            }

            await _userManager.AddToRoleAsync(user, "Member");
            return StatusCode(201);
        }

        [HttpGet("currentUser")]
        public async Task<ActionResult<UserDto>> GetCurrentUser(){
            var user = await _userManager.FindByNameAsync(User.Identity.Name);
            var userBasket = await RetrieveBasket(User.Identity.Name);

            return new UserDto{
                Email = user.Email,
                Token = await _tokenService.GenerateToken(user),
                Basket = userBasket?.MapToBasketDto() ?? null
            };
        }

        private async Task<Basket> RetrieveBasket(string buyerId)
        {
            return await this._storeContext.Baskets
            .Include(i => i.Items)
            .ThenInclude(p => p.Product)
            .FirstOrDefaultAsync(x => x.BuyerId == buyerId);
        }
    }
}