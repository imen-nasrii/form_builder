using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class PrihistMkr
    {
        public string? tkr { get; set; }
        public string? cusip { get; set; }
        public DateTime? prcdate { get; set; }
        public DateTime? date_chng { get; set; }
        public decimal? price { get; set; }
        public string? source { get; set; }
        public string? price_type { get; set; }
        public string? fund { get; set; }
        public string? tkr_type { get; set; }
        public decimal? factor { get; set; }
        public string? user_id { get; set; }
        public string? prcmemo { get; set; }
        public string? long_short { get; set; }
        public string? pricetime { get; set; }
        public string? yield_code { get; set; }
        public string? fas_code { get; set; }
        public decimal? con_lvl { get; set; }
        public string? prc_by_yld { get; set; }
        public decimal? yield { get; set; }
        public int? hash { get; set; }
    }

}
