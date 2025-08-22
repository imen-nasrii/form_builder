using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class GLGRP
    {
        public string Fund { get; set; }
        public string Glgrp { get; set; }
        public string? Desc1 { get; set; }
        public string? Desc2 { get; set; }
        public string? Glcat { get; set; }
        public string? Actype { get; set; }
        public string? Unused { get; set; }
        public decimal? Hash { get; set; }
    }

}
