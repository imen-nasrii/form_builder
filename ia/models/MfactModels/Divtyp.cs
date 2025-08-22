using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Divtyp
    {
        public string Source { get; set; }
        public string Div_Type { get; set; }
        public string? Descr { get; set; }
        public string? Taxrat { get; set; }
        public string? Taxcod { get; set; }
        public decimal? Hash { get; set; } 
    }

}
