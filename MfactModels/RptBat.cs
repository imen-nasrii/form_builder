using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class RptBat
    {
        public string Memrpt_No { get; set; }
        public string Memgrp_No { get; set; }
        public int Seqno { get; set; }
        public string? Conversion_Job { get; set; }
    }

}
