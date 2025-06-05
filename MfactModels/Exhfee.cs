using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Exhfee
    {
        public string Exch { get; set; }
        public DateTime Edate { get; set; }
        public string? Bl { get; set; }
        public decimal? Blfee { get; set; }
        public string? Sl { get; set; }
        public decimal? Slfee { get; set; }
        public string? Ss { get; set; }
        public decimal? Ssfee { get; set; }
        public string? Cs { get; set; }
        public decimal? Csfee { get; set; }
        public decimal? Hash { get; set; }
    }

}
