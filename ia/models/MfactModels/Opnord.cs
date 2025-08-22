using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Opnord
    {
        public string fund { get; set; }
        public string tkr { get; set; }
        public string? broker { get; set; }
        public string? trade_type { get; set; }
        public decimal? qty { get; set; }
        public decimal? limit { get; set; }
        public DateTime? taxlot { get; set; }
        public DateTime? trddat { get; set; }
        public decimal? verbpr { get; set; }
        public DateTime? setdat { get; set; }
        public decimal? writpr { get; set; }
        public decimal? comm { get; set; }
        public decimal? slstax { get; set; }
        public decimal? trfchg { get; set; }
        public decimal? accint { get; set; }
        public decimal? net { get; set; }
        public string? stplos { get; set; }
        public string? tkr_type { get; set; }
        public string? taxint { get; set; }
        public string opnord_no { get; set; }
        public DateTime? new_date { get; set; }
        public string? new_time { get; set; }
        public string? new_user { get; set; }
        public DateTime? phon_date { get; set; }
        public string? phon_time { get; set; }
        public string? phon_user { get; set; }
        public DateTime? verb_date { get; set; }
        public string? verb_time { get; set; }
        public string? verb_user { get; set; }
        public DateTime? writ_date { get; set; }
        public string? writ_time { get; set; }
        public string? writ_user { get; set; }
        public DateTime? cncl_date { get; set; }
        public string? cncl_time { get; set; }
        public string? cncl_user { get; set; }
        public string? child_idno { get; set; }
        public string? parnt_idno { get; set; }
        public string? taxid { get; set; }
        public decimal? taxprc { get; set; }
        public string? trxcur_no { get; set; }
        public int? hash { get; set; }
    }

}
