using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class GANDL
    {
        public string Fund { get; set; }
        public string? Open_TrxId { get; set; }
        public string? Tkr { get; set; }
        public DateTime? OpnDat { get; set; }
        public decimal? Qty { get; set; }
        public decimal? Lcl_NetEnt { get; set; }
        public DateTime? ClsDat { get; set; }
        public decimal? Lcl_NetCls { get; set; }
        public string Close_Trx { get; set; }
        public string? DumFlg { get; set; }
        public decimal? Lcl_Org_Bk { get; set; }
        public decimal? Bas_NetEnt { get; set; }
        public decimal? Bas_NetCls { get; set; }
        public decimal? Bas_Org_Bk { get; set; }
        public string? Subunit { get; set; }
        public string? Unused { get; set; }
        public DateTime? OpenSet { get; set; }
        public DateTime? CloseSet { get; set; }
        public string? Class { get; set; }
        public string? InKind { get; set; }
        public decimal? Hash { get; set; } 
    }
}
