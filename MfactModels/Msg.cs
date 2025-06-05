using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class MSG
    {
        public string? Typ { get; set; }
        public string? Descr { get; set; }
        public string? In_Out { get; set; }
        public string? Resp_Reqd { get; set; }
        public string? Q_Name { get; set; }
        public decimal? Dap_Time { get; set; }
        public decimal? Hash { get; set; }
    }

}
