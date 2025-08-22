using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Unsetl
    {
        public string fund { get; set; }
        public DateTime? setdat { get; set; }
        public DateTime? actual { get; set; }
        public string? trxtyp { get; set; }
        public string trxcur_no { get; set; }
        public string? filler { get; set; }
        public string? Class { get; set; }
        public string? asofdate { get; set; }
        public string? asoftype { get; set; }
        public decimal? amount { get; set; }
        public string? no_cash { get; set; }
        public decimal hash { get; set; }
    }
}
