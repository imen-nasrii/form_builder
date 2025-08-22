using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Report
    {
        public string? job_run { get; set; }
        public string? job_no { get; set; }
        public int? rpt_index { get; set; }
        public string? filename { get; set; }
        public string? program { get; set; }
        public string? group_tab { get; set; }
        public string? rep_type { get; set; }
        public string? user_id { get; set; }
        public DateTime? date_added { get; set; }
        public string? time_added { get; set; }
        public DateTime? start_date { get; set; }
        public DateTime? end_date { get; set; }
        public string? date_type { get; set; }
        public string? id_type { get; set; }
        public string? id { get; set; }
        public string? rpt_name { get; set; }
        public decimal? hash { get; set; }
    }

}
