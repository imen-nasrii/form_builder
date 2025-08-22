using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Trx
    {
        public string fund { get; set; } // Required
        public string trx_no { get; set; } // Required
        public DateTime? trxdate { get; set; }
        public string? acct_cr { get; set; }
        public string? acct_dr { get; set; }
        public DateTime? datent { get; set; }
        public decimal? amount { get; set; }
        public string? trx_type { get; set; }
        public string? revflg { get; set; }
        public string? check_num { get; set; }
        public string? unused { get; set; }
        public string? trxcur_no { get; set; }
        public string? enttime { get; set; }
        public string? user_id { get; set; }
        public string? revid { get; set; }
        public string? subunit { get; set; }
        public string? Class { get; set; }
        public DateTime? postdate { get; set; }
        public string? glxcat { get; set; }
        public string? long_short { get; set; }
        public int? trx_no1 { get; set; }
        public string? chfund { get; set; }
        public string? version { get; set; }
        public string? first_trx { get; set; }
        public string? auttrx_no { get; set; }
        public decimal? hash { get; set; }
    }

}
