using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Adjust
    {
        public string? Fund { get; set; }
        public string? Rule_Id { get; set; }
        public DateTime? Adj_Date { get; set; }
        public string? Class { get; set; }
        public string? Glxcat { get; set; }
        public string? Type { get; set; }
        public decimal? Value { get; set; }
        public DateTime? Entry_Time { get; set; }
        public string? Tkr { get; set; }
        public DateTime? Recdate { get; set; }
        public DateTime? End_Date { get; set; }
        public string? Comments { get; set; }
        public string? AddedBy { get; set; }
        public string? Taxlot_Id { get; set; }
        public decimal? Hash { get; set; }
    }

}
