using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Brx
    {
        public string? Tkr { get; set; }
        public string? Curr_Id { get; set; }
        public decimal? Adr_Factor { get; set; }
        public decimal? Lcl_Price { get; set; }
        public decimal? Dlr_Price { get; set; }
        public string? Md_Flag { get; set; }
        public string? Unused { get; set; }
        public decimal? Hash { get; set; }
    }

}
