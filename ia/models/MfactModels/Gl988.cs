using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Gl988
    {
        public string TrxTyp { get; set; }
        public string? EqTy { get; set; }
        public string? Fx_Cash { get; set; }
        public string? Disc { get; set; }
        public string? Coup { get; set; }
        public string? Repo { get; set; }
        public string? Mbs { get; set; }
        public string? Call { get; set; }
        public string? Futs { get; set; }
        public string? Fwds { get; set; }
        public string? Puts { get; set; }
        public string? Dmd { get; set; }
        public decimal? Hash { get; set; }
    }

}
