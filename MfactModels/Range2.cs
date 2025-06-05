using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Range2
    {
        public string Tkr { get; set; }
        public DateTime Effecdate { get; set; }
        public string Long_Short { get; set; }
        public string? Val { get; set; }
        public decimal? Rate { get; set; }
        public decimal? Bp { get; set; }
        public decimal? Strt_Range { get; set; }
        public decimal? End_Range { get; set; }
        public string? Index1 { get; set; }
        public DateTime? Date_Delet { get; set; }
        public string? User_Delet { get; set; }
        public string? Time_Delet { get; set; }
        public decimal? Hash { get; set; }
    }

}
