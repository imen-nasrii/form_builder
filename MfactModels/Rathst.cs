using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Rathst
    {
        public string? tkr { get; set; }
        public DateTime? effecdate { get; set; }
        public decimal? rate { get; set; }
        public DateTime? date_added { get; set; }
        public string? user_added { get; set; }
        public string? time_added { get; set; }
        public DateTime? date_delet { get; set; }
        public string? user_delet { get; set; }
        public string? time_delet { get; set; }
        public string? event_type { get; set; }
        public decimal? factor { get; set; }
        public decimal? split_num { get; set; }
        public decimal? split_den { get; set; }
        public DateTime? nxtpay { get; set; }
        public DateTime? call_date { get; set; }
        public decimal? call_price { get; set; }
        public string? user_ref { get; set; }
        public string? long_short { get; set; }
        public string? fund { get; set; }
        public string? fas_level { get; set; }
        public string? und_index { get; set; }
        public decimal? bas_points { get; set; }
        public string? common { get; set; }
        public string? range_type { get; set; }
        public string? source { get; set; }
        public string? div_type { get; set; }
        public string? Override { get; set; }
        public string? reinvest { get; set; }
        public DateTime? re_date { get; set; }
        public string? re_brkr { get; set; }
        public DateTime? recdate { get; set; }
        public decimal? idxval { get; set; }
        public string? idx_based { get; set; }
        public DateTime? idxdate { get; set; }
        public decimal? HASH { get; set; }
    }
}
