using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class ACTDATA
    {
        public int? Id { get; set; }
        public string? Source { get; set; }
        public string? Data { get; set; } // Using string? to represent CLOB, Oracle.ManagedDataAccess we can use this for CLOB type 
        public DateTime? Entry_Time { get; set; }
        public decimal? Hash { get; set; }
    }

}
