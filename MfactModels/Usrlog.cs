using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Usrlog
    {
        public string? ltype { get; set; }
        public string? user_id { get; set; }
        public DateTime? logdate { get; set; }
        public string? logtime { get; set; }
        public string? logip { get; set; }
        public string? adminuser { get; set; }
        public string? domain { get; set; }
        public string? end_time { get; set; }
        public decimal? hash { get; set; }
    }
}
