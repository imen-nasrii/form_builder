using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Optpro
    {
        public long procid { get; set; }
        public string? job_no { get; set; }
        public string? pgmname { get; set; }
        public string? status { get; set; }
        public string? schtyp { get; set; }
        public string? jobtyp { get; set; }
        public string? signalname { get; set; }
        public string? userid { get; set; }
        public DateTime? nxtrundate { get; set; }
        public string? jobseq { get; set; }
        public string? pgmorder { get; set; }
        public DateTime? pgmstadate { get; set; }
        public DateTime? pgmenddate { get; set; }
        public string? tskdesc { get; set; }
        public string? pid { get; set; }
        public string? lastduration { get; set; }
        public DateTime? datestamp { get; set; }
        public string? job_iteration { get; set; }
        public string? fund { get; set; }
        public int? hash { get; set; }
    }

}
