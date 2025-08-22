using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class CRsult
    {
        public string? IdNo { get; set; }             
        public DateTime? Last_Date { get; set; }      
        public string? Id { get; set; }                 
        public string? Tkr { get; set; }                
        public string? Specific { get; set; }          
        public string? SubGroup { get; set; }           
        public decimal? Value { get; set; }            
        public decimal? DenomValue { get; set; }       
        public DateTime? NavDate { get; set; }        
        public string? Type { get; set; }               
        public decimal? Percent { get; set; }           
        public string? Passed { get; set; }            
        public string? FundDesc { get; set; }           
        public string? TkrDesc { get; set; }            
        public string? Exch { get; set; }               
        public string? Pool { get; set; }            
        public string? TkrType { get; set; }            
        public string? NumGrpDesc { get; set; }         
        public string? DenGrpDesc { get; set; }        
        public string? DenSubGrp { get; set; }        
        public string? Denominator { get; set; }       
        public string? Numerator { get; set; }          
        public string? Frequency { get; set; }          
        public string? Operator { get; set; }            
        public decimal? PercentRl { get; set; }         
        public string? SpecificRl { get; set; }        
        public string? Descrl { get; set; }            
        public decimal? Hash { get; set; }                
    }

}
