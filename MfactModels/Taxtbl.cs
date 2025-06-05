using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Taxtbl
    {
        public string? DOMICILE { get; set; }
        public string? TAXCOD { get; set; }
        public string? COUNTRY { get; set; }
        public decimal? WITH_RATE { get; set; }
        public decimal? RECLAIM { get; set; }
        public string? UNUSED { get; set; }
        public string? NET { get; set; }
        public string? FUND { get; set; }
        public string? LONG_SHORT { get; set; }
        public DateTime? EFFCDATE { get; set; }
        public decimal? HASH { get; set; }
    }
}
