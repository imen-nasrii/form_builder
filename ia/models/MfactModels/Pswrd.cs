using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Pswrd
    {
        public string? User_Id { get; set; }
        public int? Pwrdcode1 { get; set; } // Nullable for NUMBER(4)
        public int? Pwrdcode2 { get; set; }
        public int? Pwrdcode3 { get; set; }
        public int? Pwrdcode4 { get; set; }
        public int? Pwrdcode5 { get; set; }
        public int? Pwrdcode6 { get; set; }
        public int? Pwrdcode7 { get; set; }
        public int? Pwrdcode8 { get; set; }
        public int? Pwrdcode9 { get; set; }
        public int? Pwrdcode10 { get; set; }
        public int? Pwrdcode11 { get; set; }
        public int? Pwrdcode12 { get; set; }
        public int? Pwrdcode13 { get; set; }
        public int? Pwrdcode14 { get; set; }
        public int? Pwrdcode15 { get; set; }
        public DateTime? PwrdDate { get; set; } // Nullable for DATE
        public string? PwrdTime { get; set; }
        public string? PswdHash { get; set; }
        public decimal? Hash { get; set; } 
    }

}
