using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Range
    {
        public string? tkr { get; set; }
        public DateTime? effecdate { get; set; }
        public int? range_type { get; set; }
        public string? long_short { get; set; }
        public string? index1 { get; set; }
        public string? index2 { get; set; }
        public string? index3 { get; set; }
        public string? relnship { get; set; }
        public string? val_true { get; set; }
        public decimal? rate_true { get; set; }
        public string? index_true { get; set; }
        public decimal? bp_true { get; set; }
        public string? val_false { get; set; }
        public decimal? rate_false { get; set; }
        public string? indexfalse { get; set; }
        public decimal? bp_false { get; set; }
        public DateTime? date_added { get; set; }
        public string? user_added { get; set; }
        public string? time_added { get; set; }
        public DateTime? date_delet { get; set; }
        public string? user_delet { get; set; }
        public string? time_delet { get; set; }
        public decimal? Hash { get; set; } 
    }

}
