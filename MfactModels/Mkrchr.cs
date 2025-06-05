using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Mkrchr
    {
        public string? menu { get; set; }
        public string? fund { get; set; }
        public string? ticker { get; set; }
        public string? long_short { get; set; }
        public DateTime? trxdate { get; set; }
        public decimal? amount { get; set; }
        public decimal? fxrate { get; set; }
        public decimal? tax { get; set; }
        public decimal? reclaim { get; set; }
        public string? user_ref { get; set; }
        public DateTime? pay_date { get; set; }
        public string? leg { get; set; }
        public string? user_id { get; set; }
        public string? active { get; set; }
        public DateTime? entdate { get; set; }
        public string? cncl_ref { get; set; }
        public DateTime? cncl_dat { get; set; }
        public string? cncl_usr { get; set; }
        public DateTime? chk_date { get; set; }
        public string? chk_usr { get; set; }
        public string? trx1 { get; set; }
        public string? trx2 { get; set; }
        public string maker_no { get; set; }
        public string? source { get; set; }
        public string? div_type { get; set; }
        public DateTime? exdate { get; set; }
        public DateTime? recdate { get; set; }
        public string? protect { get; set; }
        public string? taxcod { get; set; }
        public decimal? with_rate { get; set; }
        public decimal? reclaim_rate { get; set; }
        public string? net { get; set; }
        public decimal? with_tax { get; set; }
    }

}
