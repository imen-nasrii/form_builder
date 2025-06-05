using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Trxtyp
    {
        public string trxtyp { get; set; }
        public string? shdesc { get; set; }
        public string? lgdesc { get; set; }
        public string? ntrfac { get; set; }
        public string? settle { get; set; }
        public string? trail { get; set; }
        public string? qty { get; set; }
        public string? cash { get; set; }
        public string? gainloss { get; set; }
        public string? book { get; set; }
        public string? accinc { get; set; }
        public string? fxgainloss { get; set; }
        public string? userdefine { get; set; }
        public string? rpt_secton { get; set; }
        public string? buy_sell { get; set; }
        public string? long_short { get; set; }
        public string? unused { get; set; }
        public string? amt_qty { get; set; }
        public decimal? hash { get; set; }
    }
}
