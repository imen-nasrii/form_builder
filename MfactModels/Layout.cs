using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Layout
    {
        public string ProgName { get; set; }
        public string? FieldList { get; set; } // CLOB mapped to string
    }

}
