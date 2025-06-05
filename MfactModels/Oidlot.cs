using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{

    public class Oidlot
    {
        public string trxcur_no { get; set; }
        public string fund { get; set; }
        public string? mktprmcode { get; set; }
        public string? mktdiscode { get; set; }
        public string? acqdiscode { get; set; }
        public string? oid_code { get; set; }
        public decimal? tot_oidamt { get; set; }
        public decimal? totnoidamt { get; set; }
        public decimal? start_aip { get; set; }
        public decimal? daily_oid { get; set; }
        public DateTime? strtdatoid { get; set; }
        public DateTime? strtdatnoi { get; set; }
        public decimal? startprice { get; set; }
        public DateTime? enddatoid { get; set; }
        public DateTime? enddatnoi { get; set; }
        public DateTime? redem_date { get; set; }
        public decimal? redem_pric { get; set; }
        public decimal? ytm { get; set; }
        public decimal? daily_noid { get; set; }
        public decimal? acq_prem { get; set; }
        public decimal? modstrtprc { get; set; }
        public string? unused { get; set; }
        public string? old_amtfix { get; set; }
        public string? dummy { get; set; }
        public int? prem_days { get; set; }
        public int? mdisc_days { get; set; }
        public int? adisc_days { get; set; }
        public int? oid_days { get; set; }
        public string? asofdate { get; set; }
        public string? asoftype { get; set; }
        public int? hash { get; set; }
    }


}