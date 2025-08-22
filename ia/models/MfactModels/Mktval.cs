using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Mktval
    {
        public DateTime mkt_date { get; set; }
        public string fund { get; set; }
        public string tkr { get; set; }
        public string? currency { get; set; }
        public decimal? qty { get; set; }
        public decimal? lcl_accinc { get; set; }
        public decimal? bas_accinc { get; set; }
        public decimal? sys_accinc { get; set; }
        public decimal? cost_sec { get; set; }
        public decimal? cost_fund { get; set; }
        public decimal? cost_sys { get; set; }
        public decimal? val_sec { get; set; }
        public decimal? val_fund { get; set; }
        public decimal? val_sys { get; set; }
        public decimal? unt_sec { get; set; }
        public decimal? unt_fnd { get; set; }
        public decimal? unt_sys { get; set; }
        public decimal? fnd_pri { get; set; }
        public decimal? sec_pri { get; set; }
        public decimal? und_pri { get; set; }
        public decimal? fx_sec { get; set; }
        public decimal? fx_fund { get; set; }
        public decimal? factor { get; set; }
        public decimal? vol_prch { get; set; }
        public decimal? vol_sld { get; set; }
        public string? pcur_code { get; set; }
        public string? scur_code { get; set; }
        public decimal? fwd_fx { get; set; }
        public DateTime? fwd_fxdat { get; set; }
        public string? taxlot_id { get; set; }
        public string? price_type { get; set; }
        public string? price_src { get; set; }
        public string long_short { get; set; }
        public decimal? curr_gl { get; set; }
        public decimal? mkt_gl { get; set; }
        public decimal? local_gl { get; set; }
        public decimal? base_gl { get; set; }
        public int? hash { get; set; }
    }

}
