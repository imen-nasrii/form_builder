using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class NdCode
    {
        public string Rule_Type { get; set; }
        public string? Rule_Desc { get; set; }
        public string? Percent { get; set; }
        public string? Base_Money { get; set; }
        public int? Selection { get; set; }
        public decimal? Hash { get; set; }
    }

}
