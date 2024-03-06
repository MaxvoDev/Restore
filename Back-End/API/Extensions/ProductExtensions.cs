using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;

namespace API.Extensions
{
    public static class ProductExtensions
    {
        public static IQueryable<Product> Sort(this IQueryable<Product> query, string orderBy){
            if(string.IsNullOrWhiteSpace(orderBy)) return query.OrderBy(p => p.Name);

            query = orderBy switch{
                "price" => query.OrderBy(p => p.Price),
                "priceDesc" => query.OrderBy(p => p.Price),
                _ => query.OrderBy(p => p.Name)
            };

            return query;
        }

        public static IQueryable<Product> Search(this IQueryable<Product> query, string searchTerm){
            if(string.IsNullOrWhiteSpace(searchTerm)) return query;

            string lowerSearchTerm = searchTerm.ToLower();
            return query.Where(p => p.Name.ToLower().Contains(lowerSearchTerm));
        }

        public static IQueryable<Product> Filter(this IQueryable<Product> query, string brands, string types){
            var brandList = new List<string>();
            var typeList = new List<string>();

            if(!string.IsNullOrWhiteSpace(brands)){
                brandList.AddRange(brands.Trim().Split(",").ToList());
            }            
            if(!string.IsNullOrWhiteSpace(types)){
                typeList.AddRange(types.Trim().Split(",").ToList());
            }

            return query.Where(p => brandList.Count == 0 || brandList.Contains(p.Brand))
            .Where(p => typeList.Count == 0 || typeList.Contains(p.Type));
        }
    }
}