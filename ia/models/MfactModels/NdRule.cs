using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class NdRule
    {
        public string? Fund { get; set; }
        public string? Rule_Type { get; set; }
        public decimal? Percent { get; set; }
        public decimal? Bm_Var { get; set; }
        public int? RuleSelect { get; set; }
        public string? Selection { get; set; } // Using string? for CLOB
        public string? Time { get; set; }
        public string? Once { get; set; }
        public decimal? Hash { get; set; }
    }
}
