using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Supdate
    {
        public string field { get; set; }
        public string? field_desc { get; set; }
        public string? up_date { get; set; }
        public string? under { get; set; }
        public string? un_desc { get; set; }
        public decimal? hash { get; set; }

    }
}
