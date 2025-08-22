using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class MsgUsr
    {
        public string? User_Id { get; set; }
        public string? Msg_yp { get; set; }
        public decimal? Priority { get; set; }
        public decimal? Hash { get; set; }
    }
}
