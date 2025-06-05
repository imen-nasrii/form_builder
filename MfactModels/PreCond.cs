using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class PreCond
    {
        public string? Name { get; set; }
        public string? Conditions { get; set; } // CLOB can be represented as string?
        public DateTime? Eval_Date { get; set; }
        public string? Status { get; set; } // CLOB can be represented as string?
        public decimal? Hash { get; set; } 
    }

}
