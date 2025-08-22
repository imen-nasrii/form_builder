using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Defset
    {
        public string Usrnam { get; set; }
        public string Frmnam { get; set; }
        public string Cmpnam { get; set; }
        public string? Value { get; set; }
        public decimal? Hash { get; set; }  
    }

}
