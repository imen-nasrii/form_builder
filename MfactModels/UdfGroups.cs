using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class UdfGroups
    {
        public int group_id { get; set; }
        public string? group_tablename { get; set; }
        public int? group_order { get; set; }
        public string? group_desc { get; set; }
        public decimal? hash { get; set; }
    }
}
