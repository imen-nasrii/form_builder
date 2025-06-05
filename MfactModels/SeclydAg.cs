using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class SeclydAg
    {
        public string? Fund { get; set; }
        public DateTime? ProcDate { get; set; }
        public string Class { get; set; }
        public DateTime? Startdate { get; set; }
        public DateTime? Enddate { get; set; }
        public DateTime? Priordate { get; set; }
        public decimal? Avgshares { get; set; }
        public decimal? Expenses { get; set; }
        public decimal? Income { get; set; }
        public decimal? Offerprice { get; set; }
        public DateTime? Offerdate { get; set; }
        public decimal? Classalloc { get; set; }
        public decimal? Capclass { get; set; }
        public decimal? Revclass { get; set; }
        public decimal? Expclass { get; set; }
        public decimal? Yield { get; set; }
    }
}
