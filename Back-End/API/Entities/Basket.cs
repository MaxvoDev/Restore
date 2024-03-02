using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class Basket
    {
        public int Id { get; set; }
        public string BuyerId { get; set; }
        public List<BasketItem> Items { get; set; } = new();

        public void AddItem(Product product, int quantity){
            var existingItem = Items.FirstOrDefault(item => item.Id == product.Id);
            if(existingItem == null) 
                Items.Add(new BasketItem{ Product = product, Quantity = quantity });
            else
                existingItem.Quantity += quantity;
        }

        public void RemoveItem(int productId, int quantity){
            var basketItem = Items.FirstOrDefault(item => item.Id == productId);
            if(basketItem == null) return;
            
            basketItem.Quantity -= quantity;
            if(basketItem.Quantity == 0)
                Items.Remove(basketItem);
        }
    }
}