using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class GKCODE
    {
        public string TrxTyp { get; set; }
        public string? GkCode { get; set; }
        public string? InvType { get; set; }
        public string? Bas_Amount { get; set; }
        public string? RefDate { get; set; }
        public string? Ref_Number { get; set; }
        public string? Amount { get; set; }
        public string? RevAmount { get; set; }
        public string? GainLoss { get; set; }
        public string? Cash { get; set; }
    }

}
