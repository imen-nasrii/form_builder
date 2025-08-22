using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Contry
    {
        public string Country { get; set; }
        public string? ContryName { get; set; }
        public string? AccInc_Net { get; set; }  
        public string? TaxTreaty { get; set; }  
        public string? Cfd { get; set; }         
        public string? Suffix { get; set; }      
        public string? CfdDesc { get; set; }
        public string? IsoCode { get; set; }
        public string? BpCode { get; set; }  
        public string? Mon { get; set; }   
        public string? Tue { get; set; }     
        public string? Wed { get; set; }         
        public string? Thu { get; set; }         
        public string? Fri { get; set; }         
        public string? Sat { get; set; }          
        public string? Sun { get; set; }      
        public string? TPlus { get; set; }      
        public string? TaxLot_Liq { get; set; }   
        public decimal? Hash { get; set; }         
    }

}
