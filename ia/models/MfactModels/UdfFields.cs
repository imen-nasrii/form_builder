using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class UdfFields
    {
        public int field_id { get; set; }
        public int? group_id { get; set; }
        public string? field_desc { get; set; }
        public string? field_datatype { get; set; }
        public string? field_format { get; set; }
        public int? field_size { get; set; }
        public int? field_order { get; set; }
        public decimal? hash { get; set; }
    }
}
