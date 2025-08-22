using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Dashb
    {
        public string? Fund { get; set; }
        public string? Rec { get; set; }
        public DateTime? Start_Date { get; set; }
        public DateTime? End_Date { get; set; }
        public string? User_Id { get; set; }
        public DateTime? Rec_Date { get; set; }
        public DateTime? Pc_Date { get; set; }
        public string? Pc_Time { get; set; }
        public decimal? Match { get; set; }
        public decimal? Partial { get; set; }
        public decimal? Un_Set { get; set; }
        public decimal? Un_Mfct { get; set; }
        public string? Path_File { get; set; }
        public decimal? Cash_Tol { get; set; }
        public decimal? Qty_Tol { get; set; }
        public string? Pqty { get; set; }
        public decimal? Tol1 { get; set; }
        public string? Mkt { get; set; }
        public decimal? Tol2 { get; set; }
        public string? Book { get; set; }
        public decimal? Tol3 { get; set; }
        public string? Inc { get; set; }
        public decimal? Tol4 { get; set; }
        public string? Interface { get; set; }
        public decimal? Hash { get; set; } 
    }

}
