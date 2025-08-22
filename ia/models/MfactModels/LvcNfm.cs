using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class LvcNfm
    {
        public string TrxTyp { get; set; }
        public string Fund { get; set; }
        public string Tkr { get; set; }
        public string User_Ref { get; set; }
        public decimal? Price { get; set; }
        public decimal? Qty { get; set; }
        public string First_Trx { get; set; }
        public string? Sent { get; set; }
        public decimal? Hash { get; set; } // Changed to nullable decimal
    }

}
