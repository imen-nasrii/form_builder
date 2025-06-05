using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Aatrr
    {
        public string? Fund { get; set; }
        public DateTime? Dist_Date { get; set; }
        public DateTime? Eff_Date { get; set; }
        public decimal? Per_Shar { get; set; }
        public string? Dist_Type { get; set; }
        public int? Status { get; set; }
        public DateTime? Entry_Date { get; set; }
        public string? User_Id { get; set; }
        public string? Entry_Time { get; set; }
        public string? Class { get; set; }
        public DateTime? Rec_Date { get; set; }
        public DateTime? Pay_Date { get; set; }
        public string? Ae_Final { get; set; }
        public DateTime? Date_Delet { get; set; }
        public string? User_Delet { get; set; }
        public string? Time_Delet { get; set; }
        public decimal? Hash { get; set; }
    }

}
