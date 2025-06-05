using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class OptevtAud
    {
        public long Evtaudid { get; set; }
        public long? Evtid { get; set; }
        public string? Sessionhdl { get; set; }
        public DateTime? Evtdate { get; set; }
        public DateTime? Evtenddate { get; set; }  // Using DateTime to map to TIMESTAMP
        public string? Prgcode { get; set; }
        public string? Fund { get; set; }
        public string? Msgstr { get; set; }
        public string? Msgid { get; set; }
        public string? Evtstat { get; set; }
        public string? Usrcmnt { get; set; }
        public string? Userid { get; set; }
        public string? Nxtusr { get; set; }
        public string? Lstusr { get; set; }
        public string? Pid { get; set; }
        public DateTime? Datestamp { get; set; }  // Using DateTime to map to TIMESTAMP
        public long? Optimaedpid { get; set; }
        public string? Signoffr { get; set; }
        public string? Resver { get; set; }
        public string? Complete { get; set; }
        public string? Rule_Exception { get; set; } // Mapping CLOB to string?
        public string? Fileattach { get; set; }
        public DateTime? Start_Date { get; set; }
        public DateTime? End_Date { get; set; }
        public string? Rule_Id { get; set; }
        public string? Schema_Name { get; set; }
        public decimal? Hash { get; set; }
    }

}
