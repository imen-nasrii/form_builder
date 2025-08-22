using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Unreal
    {
        public string? fund { get; set; }
        public string? Class { get; set; }
        public string? subunit { get; set; }
        public string? glxcat { get; set; }
        public string? long_short { get; set; }
        public string? trxtyp { get; set; }
        public string? acct_dr { get; set; }
        public string? acct_cr { get; set; }
        public decimal? amount { get; set; }
        public decimal? hash { get; set; }
    }
}
