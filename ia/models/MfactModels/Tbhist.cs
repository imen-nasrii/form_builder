using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Tbhist
    {
        public string fund { get; set; }
        public DateTime navdate { get; set; }
        public string acno { get; set; }
        public string Class { get; set; }
        public decimal? endbal { get; set; }
        public decimal? cpdebit { get; set; }
        public decimal? cpcredit { get; set; }
        public string? unused { get; set; }
        public decimal? alloc { get; set; }
        public string? shrgrp { get; set; }
        public decimal? hash { get; set; }
    }
}
