using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Remind
    {
        public string? User_Id { get; set; }
        public DateTime? DateRem { get; set; }
        public string? MSG { get; set; }
        public string? Cmpltd { get; set; }
        public string? FundId { get; set; }
        public string? UsrRead { get; set; }
        public string? Personal { get; set; }
        public string? UsrCmp { get; set; }
        public DateTime? Datent { get; set; }
        public string? GroupId { get; set; }
    }
}
