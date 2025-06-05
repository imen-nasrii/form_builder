using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Mnuimg
    {
        public string Menu_Id { get; set; }
        public byte[]? Custom { get; set; }
        public byte[]? Image { get; set; }
    }

}
