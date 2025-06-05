using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class AsofOpnpos
    {
        public string Fund { get; set; }
        public string Tkr { get; set; }
        public decimal? Qty { get; set; }
        public decimal? Lclavgbook { get; set; }
        public int? Numstp { get; set; }
        public decimal? Stplos { get; set; }
        public string? Mental { get; set; }
        public string? Multi { get; set; }
        public int? Shtopt { get; set; }
        public DateTime? Expdat { get; set; }
        public DateTime? Matdat { get; set; }
        public string? Tkr_Type { get; set; }
        public string? Seccat { get; set; }
        public string? Secgrp { get; set; }
        public decimal? Lcl_Accinc { get; set; }
        public string? Taxint { get; set; }
        public DateTime? Paydat { get; set; }
        public string Long_Short { get; set; }
        public decimal? Lcltaxbook { get; set; }
        public decimal? Buyord { get; set; }
        public decimal? Selord { get; set; }
        public decimal? Basavgbook { get; set; }
        public decimal? Bastaxbook { get; set; }
        public decimal? BasAccinc { get; set; }
        public string? Unused { get; set; }
        public decimal? Origface { get; set; }
        public decimal? Llcl_Accin { get; set; }
        public decimal? Lbas_Accin { get; set; }
        public decimal? Slcl_Accin { get; set; }
        public decimal? Sbas_Accin { get; set; }
        public string Asofdate { get; set; }
        public string Asoftype { get; set; }
        public decimal? Hash { get; set; }
    }

}
