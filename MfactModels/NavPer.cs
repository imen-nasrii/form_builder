using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class NavPer
    {
        public string fund { get; set; }
        public DateTime start_date { get; set; }
        public DateTime? end_date { get; set; }
        public string? interimcls { get; set; }
        public string? final_cls { get; set; }
        public string? indic_nav { get; set; }
        public string? close { get; set; }
        public DateTime? del_date { get; set; }
        public string? mth_prcs { get; set; }
        public int? hash { get; set; }
    }

}
