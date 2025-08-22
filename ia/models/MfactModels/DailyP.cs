using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class DailyP
    {
        public string? Fund { get; set; }
        public string? Tkr { get; set; }
        public string? Cusip { get; set; }
        public DateTime? Prcdate { get; set; }
        public DateTime? Date_Chng { get; set; }
        public decimal? Price { get; set; }
        public string? Source { get; set; }
        public string? Price_Type { get; set; }
        public string? Tkr_Type { get; set; }
        public decimal? Factor { get; set; }
        public string? User_Id { get; set; }
        public string? Prcmemo { get; set; }
        public string? Pricetime { get; set; }
        public int? Rank { get; set; }
        public string? Long_Short { get; set; }
        public string? Seccat { get; set; }
        public string? Fas_Code { get; set; }
        public decimal? Con_Lvl { get; set; }
        public string? Prc_By_Yld { get; set; }
        public decimal? Yield { get; set; }
        public decimal? Hash { get; set; }
    }

}
