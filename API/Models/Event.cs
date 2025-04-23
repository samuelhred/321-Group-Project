using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models
{
    public class Event
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Date { get; set; }

        public string Location { get; set; }

    }
}