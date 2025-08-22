using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class AsofTOpnexp
    {
        public string Fund { get; set; }
        public string Class { get; set; }
        public string Auttrx_No { get; set; }
        public DateTime? Start_Date { get; set; }
        public DateTime? End_Date { get; set; }
        public DateTime? Last_Date { get; set; }
        public DateTime? Next_Date { get; set; }
        public decimal? Lcl_Accinc { get; set; }
        public decimal? Bas_Accinc { get; set; }
        public string? Lcl_Base { get; set; }
        public string? Exc_Chd { get; set; }
        public string Asofdate { get; set; }
        public string Asoftype { get; set; }
        public DateTime? Fixstart { get; set; }
        public DateTime? Fixend { get; set; }
        public decimal? Hash { get; set; }
    }

}
