using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class FundCg
    {
        public string? Fund { get; set; }
        public string? Subunit { get; set; }
        public string? Tkr { get; set; }
        public string? SecCat { get; set; }
        public string? SecGrp { get; set; }
        public string? PbyCost { get; set; }
        public string? TcCom { get; set; }
        public string? TcTrf { get; set; }
        public decimal? Hash { get; set; }
    }

}
