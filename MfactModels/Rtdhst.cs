using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Rtdhst
    {
        public string Nrsro { get; set; }
        public string Tkr { get; set; }
        public string? Source { get; set; }
        public DateTime Entry_Date { get; set; }
        public string? Revdat { get; set; }
        public string? Rating { get; set; }
        public string? Fill_Fld { get; set; }
        public decimal? Hash { get; set; }
    }

}
