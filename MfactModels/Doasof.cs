using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Doasof
    {
        public string Fund { get; set; }
        public DateTime Asofdate { get; set; }
        public string Asoftype { get; set; }
        public decimal? Id_Start { get; set; }
        public decimal? Id_End { get; set; }
    }

}
