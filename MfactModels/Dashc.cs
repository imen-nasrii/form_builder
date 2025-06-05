using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Dashc
    {
        public string? Fund { get; set; }
        public string? Rule_Type { get; set; }
        public string? VarType { get; set; }
        public DateTime? Start_Date { get; set; }
        public DateTime? End_Date { get; set; }
        public string? Program { get; set; }
        public decimal? Control1 { get; set; }
        public decimal? Control2 { get; set; }
        public decimal? Control3 { get; set; }
        public decimal? Control4 { get; set; }
        public string? User_Id { get; set; }
        public DateTime? Pc_Date { get; set; }
        public string? Pc_Time { get; set; }
        public string? Text { get; set; } // CLOB can be represented as string?
        public string? Active { get; set; }
        public decimal? Hash { get; set; } // Changed to decimal?
    }

}
