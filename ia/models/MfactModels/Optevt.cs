using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Optevt
    {
        public long evtid { get; set; }
        public string? sessionhdl { get; set; }
        public DateTime? evtdate { get; set; }
        public DateTime? evtenddate { get; set; }
        public string? msgtyp { get; set; }
        public string? evttype { get; set; }
        public string? job_no { get; set; }
        public string? tskdsc { get; set; }
        public string? prgcode { get; set; }
        public string? fund { get; set; }
        public string? msgstr { get; set; }
        public string? msgid { get; set; }
        public string? evtstat { get; set; }
        public string? usrcmnt { get; set; }
        public string? userid { get; set; }
        public string? nxtusr { get; set; }
        public string? lstusr { get; set; }
        public string? pid { get; set; }
        public DateTime? datestamp { get; set; }
        public long? optimaedpid { get; set; }
        public string? signoffr { get; set; }
        public string? resver { get; set; }
        public string? complete { get; set; }
        public string? rule_exception { get; set; }
        public string? fileattach { get; set; }
        public DateTime? start_date { get; set; }
        public DateTime? end_date { get; set; }
        public string? rule_id { get; set; }
        public string? schema_name { get; set; }
        public int? hash { get; set; }
    }

}
