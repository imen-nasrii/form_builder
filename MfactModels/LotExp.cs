using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class LotExp
    {
        public DateTime? asofdate { get; set; }
        public string fund { get; set; }
        public string? tkr { get; set; }
        public string? secid { get; set; }
        public DateTime? trade_date { get; set; }
        public DateTime? settl_date { get; set; }
        public decimal? qty { get; set; }
        public string trxcur_no { get; set; }
        public string? subunit { get; set; }
        public decimal? lclprice { get; set; }
        public decimal? localbook { get; set; }
        public decimal? lclcurval { get; set; }
        public decimal? lcl_accinc { get; set; }
        public decimal? lclgainlos { get; set; }
        public decimal? basebook { get; set; }
        public decimal? baseprice { get; set; }
        public decimal? basecurval { get; set; }
        public decimal? bas_accinc { get; set; }
        public decimal? basgainlos { get; set; }
        public string? unused { get; set; }
        public string? Class { get; set; }
        public decimal? origface { get; set; }
        public decimal? lunreal { get; set; }
        public decimal? bunreal { get; set; }
        public decimal? ytm { get; set; }
        public decimal? l_notional { get; set; }
        public decimal? s_notional { get; set; }
        public decimal? hash { get; set; }
    }

}
