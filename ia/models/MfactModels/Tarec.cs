using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Tarec
    {
        public DateTime? cur_date { get; set; }
        public string fund { get; set; }
        public string Class { get; set; }
        public decimal? nav_shr { get; set; }
        public decimal? shares { get; set; }
        public decimal? setldshare { get; set; }
        public decimal? cur_sub { get; set; }
        public decimal? cur_redd { get; set; }
        public decimal? cur_redf { get; set; }
        public decimal? cur_lospd { get; set; }
        public decimal? cur_reinv { get; set; }
        public decimal? cur_mvt { get; set; }
        public decimal? income { get; set; }
        public decimal? stcapd { get; set; }
        public decimal? ltcapd { get; set; }
        public decimal? sub_rec { get; set; }
        public decimal? red_pay { get; set; }
        public DateTime entry_time { get; set; }
        public decimal? hash { get; set; }
    }
}
