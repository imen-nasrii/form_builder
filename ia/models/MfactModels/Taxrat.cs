using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Taxrat
    {
        public string year { get; set; }
        public decimal? ordinc { get; set; }
        public decimal? ltcginc { get; set; }
        public decimal? stcginc { get; set; }
        public decimal? midterm { get; set; }
        public decimal? reit { get; set; }
        public DateTime? enddate { get; set; }
        public decimal? nqddr { get; set; }
        public decimal? nqreit { get; set; }
        public decimal? hash { get; set; }
    }
}
