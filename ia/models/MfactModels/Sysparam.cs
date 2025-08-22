using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Sysparam
    {
        public string? wsdl { get; set; }
        public string? gkstart { get; set; }
        public string? revfor { get; set; }
        public string? hedgepath { get; set; }
        public string? hedgetek { get; set; }
        public int gkmax { get; set; }
    }
}
