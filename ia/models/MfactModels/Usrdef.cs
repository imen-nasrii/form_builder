using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Usrdef
    {
        public string? user_id { get; set; }
        public string? table_name { get; set; }
        public string? descr { get; set; }
        public string? datatype { get; set; }
        public decimal? hash { get; set; }
    }
}
