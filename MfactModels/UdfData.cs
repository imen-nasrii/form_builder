using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class UdfData
    {
        public int field_id { get; set; }
        public string data_field { get; set; }
        public string? data_value { get; set; }
        public string? data_format { get; set; }
        public decimal? hash { get; set; }
    }
}
