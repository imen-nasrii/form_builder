using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Opnexp
    {
        public string fund { get; set; }
        public string Class { get; set; }
        public string auttrx_no { get; set; }
        public DateTime? start_date { get; set; }
        public DateTime? end_date { get; set; }
        public DateTime? last_date { get; set; }
        public DateTime? next_date { get; set; }
        public decimal? lcl_accinc { get; set; }
        public decimal? bas_accinc { get; set; }
        public string? lcl_base { get; set; }
        public string? exc_chd { get; set; }
        public string? asofdate { get; set; }
        public string? asoftype { get; set; }
        public DateTime? fixstart { get; set; }
        public DateTime? fixend { get; set; }
        public int? hash { get; set; }
    }

}
