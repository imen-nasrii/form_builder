using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Dasha
    {
        public string? Fund { get; set; }
        public string? Class { get; set; }
        public string? Program { get; set; }
        public DateTime? Start_Date { get; set; }
        public DateTime? End_Date { get; set; }
        public string? User_Id { get; set; }
        public decimal? Amount { get; set; }
        public DateTime? Rep_Date { get; set; }
        public DateTime? Pc_Date { get; set; }
        public string? Pc_Time { get; set; }
        public decimal? Hash { get; set; } 
    }

}
