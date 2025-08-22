using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class AsofTaxlot
    {
        public string? Fund { get; set; }
        public string? Tkr { get; set; }
        public DateTime? Trade_Date { get; set; }
        public DateTime? Settl_Date { get; set; }
        public decimal? Qty { get; set; }
        public decimal? Lcltaxbook { get; set; }
        public decimal? Opnord { get; set; }
        public decimal? Price { get; set; }
        public string? Trxcur_No { get; set; }
        public decimal? Lclorgbook { get; set; }
        public decimal? Bastaxbook { get; set; }
        public decimal? Basorgbook { get; set; }
        public string? Subunit { get; set; }
        public decimal? Lcl_Accinc { get; set; }
        public decimal? Bas_Accinc { get; set; }
        public string? Unused { get; set; }
        public string? Hot_Issue { get; set; }
        public string? Cont_1256 { get; set; }
        public decimal? Lunreal { get; set; }
        public decimal? Bunreal { get; set; }
        public decimal? Origface { get; set; }
        public string? Class { get; set; }
        public decimal? Ytm { get; set; }
        public DateTime? Accfixdate { get; set; }
        public DateTime? Amtfixdate { get; set; }
        public string? Acno { get; set; }
        public string? Asofdate { get; set; }
        public string? Asoftype { get; set; }
        public decimal? Bmargin { get; set; }
        public decimal? Lmargin { get; set; }
        public decimal? Hash { get; set; }
    }

}
