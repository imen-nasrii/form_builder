using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class MsgDefs
    {
        public decimal? Msgid { get; set; }
        public string Msgcode { get; set; }
        public string? Msgtype { get; set; }
        public string? Msgwrd { get; set; }
        public string? Msgdesc { get; set; }
        public string? Msgprg { get; set; }
        public string? Msgarea { get; set; }
        public string? Msgopt { get; set; }
        public string? BlockSchd { get; set; }
        public string? Signoffr { get; set; }
        public string? Fileattach { get; set; }
        public decimal? Hash { get; set; }
    }

}
