using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Optflt
    {
        public long FilterId { get; set; }
        public long? IdFrom { get; set; }
        public long? IdTo { get; set; }
        public string? MsgType { get; set; }
        public string? PrgName { get; set; }
        public string? Area { get; set; }
        public string? Include { get; set; }
        public decimal? Hash { get; set; }
    }

}
