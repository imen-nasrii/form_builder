using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class MsgLog
    {
        public string? Msg_Id { get; set; }
        public string? Msg_Typ { get; set; }
        public DateTime? DateSnt { get; set; }
        public string? Direction { get; set; }
        public string? Status { get; set; }
        public string? Content { get; set; }
        public string? Response { get; set; }
        public string? Fund { get; set; }
        public string? UserId { get; set; }
        public decimal? Priority { get; set; }
        public DateTime? DapUntil { get; set; }
        public string? Class { get; set; }
        public DateTime? Dated { get; set; }
        public decimal? Hash { get; set; }
    }
}
