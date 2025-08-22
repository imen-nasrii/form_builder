using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class CRules
    {
        public string? Fund { get; set; }
        public string? Numerator { get; set; }
        public string? Specific { get; set; }
        public string? Operator { get; set; }
        public string? Denominator { get; set; }
        public decimal? Percent { get; set; }
        public string? Frequency { get; set; }
        public DateTime? Last_Date { get; set; }
        public string CRules_No { get; set; }
        public string? Descr { get; set; }
        public decimal? Hash { get; set; }
    }

}
