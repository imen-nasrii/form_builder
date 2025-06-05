using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Messages
    {
        public int? MsgId { get; set; }
        public string? SessionHdl { get; set; }
        public string? MsgFund { get; set; }
        public string? MsgStr { get; set; }
        public string? MsgCode { get; set; }
        public int? MsgCurrent { get; set; }
        public int? MsgTotal { get; set; }
        public string? MsgType { get; set; }
        public string? MsgRead { get; set; }
        public DateTime? MsgDate { get; set; }
        public string? MsgTime { get; set; }
        public string? UserId { get; set; }
        public string? ProgName { get; set; }
        public string? ProcName { get; set; }
        public string? DbName { get; set; }
        public decimal? Hash { get; set; }
    }

}
