using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Trail
    {
        public string FUND { get; set; }
        public string TRX_NO { get; set; }
        public string SEQNO { get; set; }
        public string? TEXT { get; set; }
        public string? UNUSED { get; set; }
        public decimal? HASH { get; set; }
    }
}
