using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Extract
    {
        public string Code { get; set; }
        public string? Title { get; set; } = " ";
        public string? Sqlquery { get; set; } = " ";
        public string? Filelocation { get; set; } = " ";
        public string? Filename { get; set; } = " ";
        public string? Filetype { get; set; } = " ";
        public string? Fileoverwrite { get; set; } = "N";
        public string? Usesmartdate { get; set; } = "N";
        public int? Gisrecid { get; set; }
        public string? Insertedby { get; set; }
        public DateTime? Insertedon { get; set; }
        public DateTime? Datemodified { get; set; }
    }

}
