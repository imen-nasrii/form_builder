using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Holiday
    {
        public string Country { get; set; }
        public DateTime DateOfHoliday { get; set; }
        public string? Descr { get; set; }
        public decimal? Hash { get; set; }
    }

}
