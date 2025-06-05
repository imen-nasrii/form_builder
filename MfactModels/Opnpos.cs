using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Opnpos
    {
        public string fund { get; set; }
        public string tkr { get; set; }
        public decimal? qty { get; set; }
        public decimal? lclavgbook { get; set; }
        public long? numstp { get; set; }
        public decimal? stplos { get; set; }
        public string? mental { get; set; }
        public string? multi { get; set; }
        public long? shtopt { get; set; }
        public DateTime? expdat { get; set; }
        public DateTime? matdat { get; set; }
        public string? tkr_type { get; set; }
        public string? seccat { get; set; }
        public string? secgrp { get; set; }
        public decimal? lcl_accinc { get; set; }
        public string? taxint { get; set; }
        public DateTime? paydat { get; set; }
        public string long_short { get; set; }
        public decimal? lcltaxbook { get; set; }
        public decimal? buyord { get; set; }
        public decimal? selord { get; set; }
        public decimal? basavgbook { get; set; }
        public decimal? bastaxbook { get; set; }
        public decimal? bas_accinc { get; set; }
        public string? unused { get; set; }
        public decimal? origface { get; set; }
        public decimal? llcl_accin { get; set; }
        public decimal? lbas_accin { get; set; }
        public decimal? slcl_accin { get; set; }
        public decimal? sbas_accin { get; set; }
        public string? asofdate { get; set; }
        public string? asoftype { get; set; }
        public int? hash { get; set; }
    }

}
