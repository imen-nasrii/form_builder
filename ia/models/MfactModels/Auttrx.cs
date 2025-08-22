using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Auttrx
    {
        public string? Fund { get; set; }
        public string Auttrx_No { get; set; }
        public DateTime? Start_Date { get; set; }
        public DateTime? End_Date { get; set; }
        public DateTime? Last_Date { get; set; }
        public DateTime? Next_Date { get; set; }
        public string? TrxType { get; set; }
        public string? Acct_Cr { get; set; }
        public string? Acct_Dr { get; set; }
        public decimal? Amount { get; set; }
        public string? Freq { get; set; }
        public string? Trail1 { get; set; }
        public string? Trail2 { get; set; }
        public string? Trail3 { get; set; }
        public string? Pst_Trailr { get; set; }
        public DateTime? Ent_Date { get; set; }
        public string? Ent_Time { get; set; }
        public string? Ent_User { get; set; }
        public DateTime? Del_Date { get; set; }
        public string? Del_Time { get; set; }
        public string? Del_User { get; set; }
        public string? NavT_ype { get; set; }
        public string? Nav_Period { get; set; }
        public decimal? Nav_Level1 { get; set; }
        public decimal? Nav_Level2 { get; set; }
        public decimal? Nav_Level3 { get; set; }
        public decimal? Nav_Level4 { get; set; }
        public decimal? Nav_Level5 { get; set; }
        public decimal? Nav_Pcnt1 { get; set; }
        public decimal? Nav_Pcnt2 { get; set; }
        public decimal? Nav_Pcnt3 { get; set; }
        public decimal? Nav_Pcnt4 { get; set; }
        public decimal? Nav_Pcnt5 { get; set; }
        public string? Nav_Based { get; set; }
        public string? Inactive { get; set; }
        public string? Unused { get; set; }
        public string? Series { get; set; }
        public string? Ismin { get; set; }
        public decimal? Minamount { get; set; }
        public string? Minperd { get; set; }
        public DateTime? Minstart { get; set; }
        public DateTime? Minend { get; set; }
        public string? Adjust { get; set; }
        public string? Search { get; set; }
        public string? Exc_Chd { get; set; }
        public string? Curncy { get; set; }
        public string? Glxcat { get; set; }
        public string? Portfolio { get; set; }
        public string? Isfix { get; set; }
        public decimal? Fixamount { get; set; }
        public string? Fixperd { get; set; }
        public DateTime? Fixstart { get; set; }
        public DateTime? Fixend { get; set; }
        public decimal? Hash { get; set; }
    }

}
