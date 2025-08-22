using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class AsofTUnsetl
    {
        public string Fund { get; set; }
        public DateTime? Setdat { get; set; }
        public DateTime? Actual { get; set; }
        public string? Trxtyp { get; set; }
        public string Trxcur_No { get; set; }
        public string? Filler { get; set; }
        public string? Class { get; set; }
        public string Asofdate { get; set; }
        public string Asoftype { get; set; }
        public decimal? Amount { get; set; }
        public string? No_Cash { get; set; }
        public decimal? Hash { get; set; }
    }

}
