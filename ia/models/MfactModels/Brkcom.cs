using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Bkrcom
    {
        public string Fund { get; set; }
        public string Broker { get; set; }
        public string Reason { get; set; }
        public DateTime TrdDate { get; set; }
        public decimal? Imputed { get; set; }
        public decimal? Actual { get; set; }
        public decimal? Hash { get; set; }
    }

}
