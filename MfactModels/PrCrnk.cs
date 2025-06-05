using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class PrCrnk
    {
        public string RankId { get; set; }
        public string? RuleId { get; set; }
        public string? Fund { get; set; }
        public string? SecCat { get; set; }
        public string? Tkr_Type { get; set; }
        public string? Long_Short { get; set; }
        public string? PSource { get; set; }
        public string? PType { get; set; }
        public int? Rank { get; set; }
        public string? FairVal { get; set; }
        public decimal? Hash { get; set; }
    }

}
