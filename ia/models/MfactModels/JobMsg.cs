using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class JobMsg
    {
        public string? Job_No { get; set; }
        public string? Msg { get; set; }
        public decimal? Exe_Date { get; set; }
        public int? Task_No { get; set; }
        public string? Progname { get; set; }
        public decimal? Hash { get; set; }
    }

}
