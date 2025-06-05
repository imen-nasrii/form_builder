using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class MsgErr
    {
        public string? Typ { get; set; }
        public decimal? Errid { get; set; }
        public decimal? Priority { get; set; }
        public string? Text { get; set; }
        public decimal? Hash { get; set; }
    }

}
