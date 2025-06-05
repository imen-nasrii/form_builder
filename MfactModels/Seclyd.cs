using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Secyld
    {
        public string? Fund { get; set; }
        public DateTime? ProcDate { get; set; }
        public string TkrDesc { get; set; }
        public string Tkr { get; set; }
        public decimal? Qty { get; set; }
        public decimal? Accinc { get; set; }
        public DateTime? PurchDate { get; set; }
        public string PurchIdno { get; set; }
        public decimal? Purchprice { get; set; }
        public DateTime? SellDate { get; set; }
        public string SellIdno { get; set; }
        public decimal? SellPrice { get; set; }
        public decimal? Ytm { get; set; }
        public decimal? Totlincome { get; set; }
        public string Secyldtype { get; set; }
        public decimal? Coupon { get; set; }
        public DateTime? MatDate { get; set; }
        public int? Days { get; set; }
        public string Reset { get; set; }
        public long? TaxlotPtr { get; set; }
        public long? GandlPtr { get; set; }
        public string Edit { get; set; }
        public int? Type6Days { get; set; }
        public string Paydown { get; set; }
        public decimal? Fxrate { get; set; }
        public string Fillr { get; set; }
        public string Sycurr { get; set; }
        public string SwapLs { get; set; }
        public DateTime? CallDate { get; set; }
        public decimal? CallPrice { get; set; }
    }

}
