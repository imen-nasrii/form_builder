using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class RptGrp
    {
        public string Memgrp_No { get; set; }
        public string? Descr { get; set; }
        public string? Frequency { get; set; }
        public string? Printrpt { get; set; }
        public string? Archive { get; set; }
        public DateTime? Last_Date { get; set; }
        public DateTime? Next_Date { get; set; }
        public string? Print_Loc { get; set; }
        public string? Fileformat { get; set; }
        public string? Attach { get; set; }
        public byte[]? Email { get; set; }
    }

}
