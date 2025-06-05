using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class PRGNAM
    {
        public string PrgNam { get; set; }
        public string? Pgm_Name { get; set; }
        public string? PChain { get; set; }
        public string? Menu_Id { get; set; }
        public string? Fund_Secur { get; set; }
        public string? Unused { get; set; } // Unused fields can be represented as string?
        public decimal? Hash { get; set; } // Use decimal for NUMBER(11)
    }

}
