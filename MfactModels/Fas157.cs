using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class FAS157
    {
        public string? Source { get; set; }
        public string? Price_Type { get; set; }
        public string? Fas_Code { get; set; }
        public string? Fas_Level { get; set; }
        public DateTime? Date_Added { get; set; }
        public string? Time_Added { get; set; }
        public string? User_Added { get; set; }
        public DateTime? Date_Delet { get; set; }
        public string? Time_Delet { get; set; }
        public string? User_Delet { get; set; }
        public decimal? Hash { get; set; }
    }

}
