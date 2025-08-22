using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Gnskpr
    {
        public string fund { get; set; }
        public DateTime start_date { get; set; }
        public DateTime? end_date { get; set; }
        public string? start_idno { get; set; }
        public string? end_idno { get; set; }
        public DateTime? xtrctdate { get; set; }
        public DateTime? txtrctdate { get; set; }
        public int? requestty { get; set; }
        public int? requestly { get; set; }
        public int? receiptty { get; set; }
        public int? receiptly { get; set; }
        public DateTime? req_date { get; set; }
        public DateTime? rec_date { get; set; }
        public decimal? hash { get; set; }
    }

}
