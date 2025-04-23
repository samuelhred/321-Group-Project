using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models
{
     public class Vendor
    {
        public int id { get; set; }
        public string Name { get; set; }

        public string Type { get; set; }

        public string Address { get; set; }

        public string Phone { get; set; }

        public string Email { get; set; }

        public string Contact { get; set; }

        public string Website { get; set; }

        public string Username { get; set; }
        public string Password { get; set; }

    }
}