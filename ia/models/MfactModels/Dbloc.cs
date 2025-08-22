using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Dbloc
    {
        public string? Dbdesc { get; set; }
        public string Dblocation { get; set; }
        public string? Unc_Dbloc { get; set; }
        public string? Lgview { get; set; }
        public string? Dash { get; set; }
        public string? Reports { get; set; }
        public decimal? Hash { get; set; } // Changed to decimal?
    }

}
