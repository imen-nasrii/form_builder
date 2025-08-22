using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class SigTkr
    {
        public string sig { get; set; }
        public string? tkr { get; set; }
        public decimal? hash { get; set; }
    }
}
