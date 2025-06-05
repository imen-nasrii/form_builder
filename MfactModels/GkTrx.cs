using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class GkTrx
    {
        public DateTime? AsofDate { get; set; }
        public string? Fund { get; set; }
        public string? TrxCur_No { get; set; }
        public DateTime? Trade_Date { get; set; }
        public string? Tkr { get; set; }
        public string? SecType { get; set; }
        public string? TrxDesc { get; set; }
        public string? Ref_Number { get; set; }
        public decimal? Qty { get; set; }
        public decimal? Bas_Amount { get; set; }
        public string? AuxId { get; set; }
        public DateTime? EntDat2 { get; set; }
        public string? RevFlg { get; set; }
        public string? First_Trx { get; set; }
        public string? SecName { get; set; }
        public DateTime? ExpDate { get; set; }
        public decimal? CostSold { get; set; }
        public string? TrxTyp { get; set; }
        public string? GroupId { get; set; }
        public string? Broker { get; set; }
        public string? InstallId { get; set; }
        public decimal? Base_Book { get; set; }
        public string? Tkr_Desc { get; set; }
        public string? Start_Date { get; set; }
        public string? End_Date { get; set; }
    }

}
