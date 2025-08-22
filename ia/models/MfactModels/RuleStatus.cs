using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class RuleStatus
    {
        public string? Rule_Id { get; set; }
        public string? Pre_Names { get; set; }
        public string? ValidFunds { get; set; }
        public DateTime? Eval_Date { get; set; }
        public decimal? Hash { get; set; }
    }

}
