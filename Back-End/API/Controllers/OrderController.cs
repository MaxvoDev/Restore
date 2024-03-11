using API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers{
    [Authorize]
    public class OrderController{
        private readonly StoreContext _context;
        public OrderController(StoreContext _context)
        {
            this._context = _context;
        }

    }
}