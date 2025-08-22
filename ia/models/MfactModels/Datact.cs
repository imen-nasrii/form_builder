using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Datact
    {
        public decimal Id { get; set; }
        public string? Source { get; set; }
        public string? Data { get; set; } // CLOB can be represented as string?
        public DateTime? EntryTime { get; set; }
        public decimal? Hash { get; set; } // Changed to decimal?
    }

}
