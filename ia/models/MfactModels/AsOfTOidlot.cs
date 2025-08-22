using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class AsofTOidlot
    {
        public string? Trxcur_No { get; set; }
        public string? Fund { get; set; }
        public string? Mktprmcode { get; set; }
        public string? Mktdiscode { get; set; }
        public string? Acqdiscode { get; set; }
        public string? Oid_Code { get; set; }
        public decimal? Tot_Oidamt { get; set; }
        public decimal? Totnoidamt { get; set; }
        public decimal? Start_Aip { get; set; }
        public decimal? Daily_Oid { get; set; }
        public DateTime? Strtdatoid { get; set; }
        public DateTime? Strtdatnoi { get; set; }
        public decimal? Startprice { get; set; }
        public DateTime? Enddatoid { get; set; }
        public DateTime? Enddatnoi { get; set; }
        public DateTime? Redem_Date { get; set; }
        public decimal? Redem_Pric { get; set; }
        public decimal? Ytm { get; set; }
        public decimal? Daily_Noid { get; set; }
        public decimal? Acq_Prem { get; set; }
        public decimal? Modstrtprc { get; set; }
        public string? Unused { get; set; }
        public string? Old_Amtfix { get; set; }
        public string? Dummy { get; set; }
        public int? Prem_Days { get; set; }
        public int? Mdisc_Days { get; set; }
        public int? Adisc_Days { get; set; }
        public int? Oid_Days { get; set; }
        public string? Asofdate { get; set; }
        public string? Asoftype { get; set; }
        public decimal? Hash { get; set; }
    }

}
