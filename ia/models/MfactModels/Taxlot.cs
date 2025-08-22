using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Taxlot
    {
        public string? fund { get; set; }
        public string? tkr { get; set; }
        public DateTime? trade_date { get; set; }
        public DateTime? settl_date { get; set; }
        public decimal? qty { get; set; }
        public decimal? lcltaxbook { get; set; }
        public decimal? opnord { get; set; }
        public decimal? price { get; set; }
        public string? trxcur_no { get; set; }
        public decimal? lclorgbook { get; set; }
        public decimal? bastaxbook { get; set; }
        public decimal? basorgbook { get; set; }
        public string? subunit { get; set; }
        public decimal? lcl_accinc { get; set; }
        public decimal? bas_accinc { get; set; }
        public string? unused { get; set; }
        public string? hot_issue { get; set; }
        public string? cont_1256 { get; set; }
        public decimal? lunreal { get; set; }
        public decimal? bunreal { get; set; }
        public decimal? origface { get; set; }
        public string? Class { get; set; }
        public decimal? ytm { get; set; }
        public DateTime? accfixdate { get; set; }
        public DateTime? amtfixdate { get; set; }
        public string? acno { get; set; }
        public string? asofdate { get; set; }
        public string? asoftype { get; set; }
        public decimal? bmargin { get; set; }
        public decimal? lmargin { get; set; }
        public decimal? hash { get; set; }
    }
}
