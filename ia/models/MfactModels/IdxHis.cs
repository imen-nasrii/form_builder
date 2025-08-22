using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class IdxHis
    {
        public string? Findex { get; set; }
        public DateTime? EffDate { get; set; }
        public decimal? IdxVal { get; set; }
        public string? Val_Time { get; set; }
        public decimal? Hash { get; set; }
    }

}
