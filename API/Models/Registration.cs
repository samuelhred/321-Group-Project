using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models
{
    public class Registration
    {
        public int Id { get; set; }

        public int VendorId { get; set; }

        public int ProductId { get; set; }

        public int EventId { get; set; }
    }
}