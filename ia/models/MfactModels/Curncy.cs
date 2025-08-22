using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Curncy
    {
        public string Currency { get; set; }
        public string? Name { get; set; }
        public string? Tkr { get; set; }
        public string? Symbol { get; set; }
        public string? Lcl_M_Decs { get; set; }
        public string? Qty_Decs { get; set; }
        public string? Price_Decs { get; set; }
        public string? Bas_M_Decs { get; set; }
        public string? Reciprical { get; set; }
        public string? Fwd_Tkr_7 { get; set; }
        public string? Fwd_Tkr_30 { get; set; }
        public string? Fwd_Tkr_60 { get; set; }
        public string? Fwd_Tkr_90 { get; set; }
        public string? Fwd_Tkr180 { get; set; }
        public string? Euro_Code { get; set; }
        public decimal? Euro_Rate { get; set; }
        public string? Euro_Round { get; set; }
        public string? Fwd_Tkr360 { get; set; }
        public string? Unused { get; set; }
        public string? Fwd_Tkr365 { get; set; }
        public string? Fwd_Tkr720 { get; set; }
        public decimal? Hash { get; set; }
    }
}
