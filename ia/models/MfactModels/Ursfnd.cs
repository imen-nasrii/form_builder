using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Ursfnd
    {
        public string user_id { get; set; }
        public string fund { get; set; }
        public string? unused { get; set; }
        public decimal? hash { get; set; }
    }
}
