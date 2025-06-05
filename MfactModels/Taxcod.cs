using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Taxcod
    {
        public string taxcod { get; set; }
        public string? descr { get; set; }
        public decimal? hash { get; set; }
    }
}
