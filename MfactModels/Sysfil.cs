using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Sysfil
    {
        public string? cat { get; set; }
        public string? id { get; set; }
        public string? loc { get; set; }
        public string? fund { get; set; }
        public string? counter1 { get; set; }
        public string? counter2 { get; set; }
        public string? counter3 { get; set; }
        public string? unused { get; set; }
        public decimal? hash { get; set; }
    }
}
