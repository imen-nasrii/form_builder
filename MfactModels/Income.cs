using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Income
    {
        public string? fund { get; set; }
        public string? tkr { get; set; }
        public DateTime? effecdate { get; set; }
        public decimal? lstdiv { get; set; }
        public decimal? lcl_accinc { get; set; }
        public decimal? bas_accinc { get; set; }
        public DateTime? nxtpay { get; set; }
        public string? long_short { get; set; }
        public string? source { get; set; }
        public string? div_type { get; set; }
        public decimal? qty { get; set; }
        public string? user_ref { get; set; }
        public string? reinvest { get; set; }
        public DateTime? re_date { get; set; }
        public string? re_brkr { get; set; }
        public string? protect { get; set; }
        public decimal? lcl_gross { get; set; }
        public decimal? tax { get; set; }
        public string? net { get; set; }
        public decimal? with_rate { get; set; }
        public decimal? reclaim { get; set; }
        public decimal? rec_amt { get; set; }
        public string? taxcod { get; set; }
        public string? old_method { get; set; }
        public DateTime? recdate { get; set; }
        public string? asofdate { get; set; }
        public string? asoftype { get; set; }
        public decimal? hash { get; set; }
    }

}
