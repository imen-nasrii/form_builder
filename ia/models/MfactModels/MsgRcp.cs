using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class MsgRcp
    {
        public string? Recip_Name { get; set; }
        public string? Recip_Dest { get; set; }
        public string? Fund { get; set; }
        public string? Rule { get; set; }
        public string? Typ { get; set; }
        public decimal? Hash { get; set; }
    }
}
