using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class MastMenu
    {
        public string menu_id { get; set; }
        public string? descript { get; set; }
        public string? prog_name { get; set; }
        public string? delphi { get; set; }
        public string? enabled { get; set; }
        public string? runproc { get; set; }
        public string? dll_name { get; set; }
        public string? trxflag { get; set; }
        public string? menuflag { get; set; }
        public string? wsflag { get; set; }
        public string? ui { get; set; }
        public string? helpfile { get; set; }
        public decimal? counter { get; set; }
        public string? soapdll { get; set; }
        public string? isapidll { get; set; }
        public int? type { get; set; }
        public string? table_name { get; set; }
        public string? report { get; set; }
        public string? ldreport { get; set; }
        public string? allowudf { get; set; }
        public decimal? hash { get; set; }
    }

}
