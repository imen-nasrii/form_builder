using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Sessions
    {
        public string ssnhandle { get; set; }
        public string? installid { get; set; }
        public string? userid { get; set; }
        public string? dataloc { get; set; }
        public string? adminuser { get; set; }
        public string? gisuser { get; set; }
        public DateTime? systemdate { get; set; }
        public string? comptrname { get; set; }
        public int? port { get; set; }
        public decimal? wndhnd { get; set; }
        public decimal? hash { get; set; }
    }
}
