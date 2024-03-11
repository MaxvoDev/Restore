using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class BasketController : BaseApiController
    {
        private readonly StoreContext _storeContext;
        public BasketController(StoreContext storeContext)
        {
            this._storeContext = storeContext;
        }

        [HttpGet(Name = "GetBasket")]
        public async Task<ActionResult<BasketDto>> GetBasket()
        {
            var basket = await RetrieveBasket(GetBasketID());

            if (basket == null) return NotFound();
            return basket.MapToBasketDto();
        }

        [HttpPost]
        public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity)
        {
            var basket = await RetrieveBasket(GetBasketID());
            if (basket == null)
            {
                basket = CreateBasket();
            }
            var product = await this._storeContext.Products.FindAsync(productId);
            if (product == null) return NotFound();

            basket.AddItem(product, quantity);

            var result = await _storeContext.SaveChangesAsync() > 0;

            if (result) return CreatedAtRoute("GetBasket", basket.MapToBasketDto());

            return BadRequest(new ProblemDetails { Title = "Problem Saving Item To Basket " });

        }

        [HttpDelete]
        public async Task<ActionResult> RemoveBasketItem(int productId, int quantity)
        {
            var basket = await RetrieveBasket(GetBasketID());
            if (basket == null) return NotFound();

            basket.RemoveItem(productId, quantity);
            var result = await _storeContext.SaveChangesAsync() > 0;
            if (result) return Ok();

            return BadRequest(new ProblemDetails { Title = "Problem Remove Item From Basket " });
        }

        private Basket CreateBasket()
        {
            var buyerId = User.Identity?.Name;
            if(string.IsNullOrEmpty(buyerId)){
                buyerId = Guid.NewGuid().ToString();
                var cookieOption = new CookieOptions
                {
                    IsEssential = true,
                    Expires = DateTime.Now.AddDays(3),
                };
                Response.Cookies.Append("buyerId", buyerId, cookieOption);
            }

            var basket = new Basket {  BuyerId = buyerId };
            _storeContext.Baskets.Add(basket);
            return basket;
        }

        private string  GetBasketID(){
            return User.Identity?.Name ?? Request.Cookies["buyerId"];
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