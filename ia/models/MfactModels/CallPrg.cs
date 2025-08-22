using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class CallPrg
    {
        public int? Id { get; set; }
        public string Fund { get; set; }
        public string? Data_Xml { get; set; }  // CLOB is typically represented as a string?
        public string? Prog_Name { get; set; }
        public string Guid { get; set; }
        public DateTime? Entry_Time { get; set; }
        public string? Dec_Char { get; set; }
        public string? Date_Format { get; set; }
        public decimal? Hash { get; set; }
    }

}
