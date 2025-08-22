using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class GkMst
    {
        public string? Fund { get; set; }
        public string? TrxCur_No { get; set; }
        public DateTime? Trade_Date { get; set; }
        public string? Tkr { get; set; }
        public string? SecType { get; set; }
        public string? LongShort { get; set; }
        public decimal? Qty { get; set; }
        public decimal? BasTaxBook { get; set; }
        public string? AuxId { get; set; }
        public DateTime? XtrctDate { get; set; }
        public string? InstallId { get; set; }
        public string? TkrDesc { get; set; }
    }

}
