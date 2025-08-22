using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class MastRpt
    {
        public string PrgNam { get; set; }
        public string? Package { get; set; }
        public string? ClassName { get; set; }
        public string? Descript { get; set; }
        public string? Dash { get; set; }
        public int? Type { get; set; }
        public decimal? Hash { get; set; }
    }

}
