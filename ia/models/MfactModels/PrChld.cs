using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class PrChld
    {
        public string? Parent { get; set; }
        public string? Child { get; set; }
        public decimal? Cap_Alloc { get; set; }
        public decimal? Exp_Alloc { get; set; }
        public decimal? Dis_Alloc { get; set; }
        public decimal? Hash { get; set; }
    }

}
