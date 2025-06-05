using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Datcon
    {
        public string? Job_No { get; set; }
        public string? Conditions { get; set; } // CLOB can be represented as string?
        public DateTime? Del_Time { get; set; }
        public DateTime? Edit_Time { get; set; }
        public string? Status { get; set; } // CLOB can be represented as string?
        public DateTime? Eval_Date { get; set; }
        public decimal? Hash { get; set; } // Changed to decimal?
    }
}
