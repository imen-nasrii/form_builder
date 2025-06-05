using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Setexc
    {
        public string fund { get; set; }
        public string? tkr { get; set; }
        public string trxcur_no { get; set; }
        public DateTime? new_setdat { get; set; }
        public decimal? hash { get; set; }
    }
}
