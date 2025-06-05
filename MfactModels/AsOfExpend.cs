using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class AsofExpend
    {
        public string Fund { get; set; }
        public string Child { get; set; }
        public string Class { get; set; }
        public string Auttrx_No { get; set; }
        public decimal? Lcl_Accinc { get; set; }
        public decimal? Bas_Accinc { get; set; }
        public string Asofdate { get; set; }
        public string Asoftype { get; set; }
        public decimal? Hash { get; set; }
    }

}
