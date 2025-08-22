using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class JobScd
    {
        public string job_no { get; set; }
        public string? job_descr { get; set; }
        public int? job_type { get; set; }
        public int? sched_type { get; set; }
        public string? email { get; set; } // CLOB mapped as string
        public string? filename { get; set; } // CLOB mapped as string
        public string? use_file { get; set; }
        public string? sched_xml { get; set; } // CLOB mapped as string
        public string? tasks_xml { get; set; } // CLOB mapped as string
        public DateTime? date_added { get; set; }
        public DateTime? date_delet { get; set; }
        public string? user_added { get; set; }
        public string? user_delet { get; set; }
        public string? time_added { get; set; }
        public string? time_delet { get; set; }
        public DateTime? date_edit { get; set; }
        public string? time_edit { get; set; }
        public decimal? last_run { get; set; }
        public decimal? next_run { get; set; }
        public string? rpt_loc { get; set; }
        public string? rpt_subloc { get; set; }
        public string? rpt_name { get; set; }
        public string? rpt_override { get; set; }
        public DateTime? lststartd { get; set; }
        public string? lststartt { get; set; }
        public string? fund_select { get; set; }
        public string? date_select { get; set; }
        public string? postdate_select { get; set; }
        public string? prcdate_select { get; set; }
        public string? country { get; set; }
        public int? holiday_mode { get; set; }
        public string? track_pm { get; set; }
        public string? next_iteration { get; set; }
        public string? last_iteration { get; set; }
        public int? last_failedtask { get; set; }
        public string? job_batchid { get; set; }
        public string? fundtask { get; set; }
        public string? datatree { get; set; } // CLOB mapped as string
        public decimal? hash { get; set; }
    }

}
