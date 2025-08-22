using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Yields
    {
        public string nrsro { get; set; }
        public string rating { get; set; }
        public DateTime effec_date { get; set; }
        public decimal? yield { get; set; }
        public int year { get; set; }
        public string? unused { get; set; }
        public decimal? hash { get; set; }
    }
}
