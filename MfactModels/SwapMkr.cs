using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class SwapMkr
    {
        public string tkr { get; set; }
        public string long_short { get; set; }
        public string? var_rate { get; set; }
        public decimal? lstdiv { get; set; }
        public decimal? notional { get; set; }
        public string? accmth { get; set; }
        public int? int_cycle { get; set; }
        public DateTime? datdat { get; set; }
        public DateTime? issue_date { get; set; }
        public string? currency { get; set; }
        public string? country { get; set; }
        public string? rate_cycle { get; set; }
        public DateTime? nxtratdate { get; set; }
        public string? ib { get; set; }
        public string? und_index { get; set; }
        public decimal? bas_points { get; set; }
        public string? range { get; set; }
        public DateTime? fpay { get; set; }
        public string? accrat { get; set; }
        public string? rdc { get; set; }
        public int? rdcday { get; set; }
        public int? irreg_freq { get; set; }
        public string? skipholiday { get; set; }
        public int? schdtype { get; set; }
        public int? schdparm1 { get; set; }
        public int? schdparm2 { get; set; }
        public int? schdparm3 { get; set; }
        public decimal? hash { get; set; }
    }
}
