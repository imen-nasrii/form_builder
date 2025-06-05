using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Fairv
    {
        public string? Fund { get; set; }
        public string? Tkr_type { get; set; }
        public string? Seccat { get; set; }
        public string? Long_short { get; set; }
        public string? Fv { get; set; }
        public string? Findex1 { get; set; }
        public string? Findex2 { get; set; }
        public decimal? Diff { get; set; }
        public decimal? Pct { get; set; }
        public string? Val_time1 { get; set; }
        public string? Val_time2 { get; set; }
        public int? Dat_adj1 { get; set; }
        public int? Dat_adj2 { get; set; }
        public DateTime? Date_delet { get; set; }
        public string? Time_delet { get; set; }
        public string? User_delet { get; set; }
        public DateTime? Date_added { get; set; }
        public string? User_added { get; set; }
        public string? Time_added { get; set; }
        public decimal? Hash { get; set; }
    }

}
