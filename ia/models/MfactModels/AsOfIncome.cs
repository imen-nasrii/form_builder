using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class AsofIncome
    {
        public string? Fund { get; set; }
        public string? Tkr { get; set; }
        public DateTime? Effecdate { get; set; }
        public decimal? Lstdiv { get; set; }
        public decimal? Lcl_Accinc { get; set; }
        public decimal? Bas_Accinc { get; set; }
        public DateTime? Nxtpay { get; set; }
        public string? Long_Short { get; set; }
        public string? Source { get; set; }
        public string? Div_Type { get; set; }
        public decimal? Qty { get; set; }
        public string? User_Ref { get; set; }
        public string? Reinvest { get; set; }
        public DateTime? ReDate { get; set; }
        public string? ReBrkr { get; set; }
        public string? Protect { get; set; }
        public decimal? Lcl_Gross { get; set; }
        public decimal? Tax { get; set; }
        public string? Net { get; set; }
        public decimal? With_Rate { get; set; }
        public decimal? Reclaim { get; set; }
        public decimal? Rec_Amt { get; set; }
        public string? Taxcod { get; set; }
        public string? Old_Method { get; set; }
        public DateTime? Recdate { get; set; }
        public string? Asofdate { get; set; }
        public string? Asoftype { get; set; }
        public decimal? Hash { get; set; }
    }

}
