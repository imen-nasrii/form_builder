using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Legent
    {
        public string Lei { get; set; }
        public string? Leiname { get; set; }
        public string? Parent { get; set; }
        public decimal? Hash { get; set; } // Using nullable decimal for NUMBER(11)
    }

}
