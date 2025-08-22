using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Bigbro
    {
        public string? TableName { get; set; }
        public string? Fund { get; set; }
        public DateTime? Chg_Date { get; set; }
        public string? Chg_Time { get; set; }
        public string? User_Id { get; set; }
        public string? Key_Data { get; set; }
        public string? Field { get; set; }
        public int? Serl_Num { get; set; }
        public string? Old_Data { get; set; }
        public string? New_Data { get; set; }
        public DateTime? SystemDate { get; set; }
        public string? Reason { get; set; }
        public string? Domain { get; set; }
        public string? Ip { get; set; }
        public string? End_Time { get; set; }
        public decimal? Hash { get; set; }
    }

}
