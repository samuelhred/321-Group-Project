using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models
{
    public class Shop
    {
        public int id { get; set; }
        public string Name { get; set; }
        public int Rating { get; set; }
        public DateTime Date { get; set; }
        public string Favorited { get; set; }
    }
}