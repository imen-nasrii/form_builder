using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class GkDet
    {
        public string? Fund { get; set; }
        public string? TrxCur_No { get; set; }
        public string? Tkr { get; set; }
        public string? SecType { get; set; }
        public DateTime? Wash_Date { get; set; }
        public decimal? Shares { get; set; }
        public decimal? LossAmount { get; set; }
        public string? Wash_No { get; set; }
        public string? InstallId { get; set; }
        public string? TkrDesc { get; set; }
    }

}
