using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Usrico
    {
        public string user_id { get; set; }
        public string menu_id { get; set; }
        public string? shortcut { get; set; }
        public decimal? iconnumber { get; set; }
    }
}
