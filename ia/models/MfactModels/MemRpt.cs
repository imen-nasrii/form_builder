using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class MemRpt
    {
        public string? MemRpt_No { get; set; }
        public string? Component { get; set; }
        public string? PropName { get; set; }
        public int? PropType { get; set; }
        public string? OnExit { get; set; }
        public byte[]? Props { get; set; }
    }

}
