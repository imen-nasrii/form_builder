using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class PosExp
    {
        public DateTime asofdate { get; set; }
        public string fund { get; set; }
        public string tkr { get; set; }
        public string? secid { get; set; }
        public decimal? qty { get; set; }
        public string long_short { get; set; }
        public decimal? localbook { get; set; }
        public decimal? lclcurval { get; set; }
        public decimal? lcl_accinc { get; set; }
        public decimal? lclgainlos { get; set; }
        public decimal? basebook { get; set; }
        public decimal? basecurval { get; set; }
        public decimal? bas_accinc { get; set; }
        public decimal? basgainlos { get; set; }
        public string? yield { get; set; }
        public string? ytm { get; set; }
        public DateTime? expmatdate { get; set; }
        public DateTime? paydate { get; set; }
        public string? accmth { get; set; }
        public int? daysacc { get; set; }
        public decimal? pctport { get; set; }
        public decimal? pctnet { get; set; }
        public string? unused { get; set; }
        public decimal? origface { get; set; }
        public decimal? llcl_accin { get; set; }
        public decimal? lbas_accin { get; set; }
        public decimal? slcl_accin { get; set; }
        public decimal? sbas_accin { get; set; }
        public decimal? l_notional { get; set; }
        public decimal? s_notional { get; set; }
        public int? hash { get; set; }
    }

}
