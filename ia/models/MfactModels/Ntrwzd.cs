using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Ntrwzd
    {
        public string NtrwzdCode { get; set; }
        public string? NtrwzdDesc { get; set; }
        public string? ProgName { get; set; }
        public int FileFormat { get; set; }
        public string? DateFmt { get; set; }
        public string? XmlFile { get; set; } // CLOB field represented as string?
        public string? Source { get; set; }
        public string? Node { get; set; }
        public string? DailyP { get; set; }
        public string? InKind { get; set; }
    }

}
