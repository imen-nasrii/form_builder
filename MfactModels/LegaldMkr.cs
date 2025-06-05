using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class LegaldMkr
    {
        public string? Tkr { get; set; }
        public string? Line1 { get; set; }
        public string? Line2 { get; set; }
        public string? Line3 { get; set; }
        public string? Line4 { get; set; }
        public string? Line5 { get; set; }
        public string? Line6 { get; set; }
        public decimal? Next_Rcd { get; set; } // Using nullable decimal for NUMBER(20)
        public decimal? Hash { get; set; }    // Using nullable decimal for NUMBER(11)
    }

}
