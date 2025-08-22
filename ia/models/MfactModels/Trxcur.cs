using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class Trxcur
    {
        public string trxcur_no { get; set; }
        public string fund { get; set; }
        public string? tkr { get; set; }
        public string? trxtyp { get; set; }
        public DateTime? trade_date { get; set; }
        public decimal? lcl_netcas { get; set; }
        public decimal? bas_netcas { get; set; }
        public string? revflg { get; set; }
        public string? revid { get; set; }
        public DateTime? entdat { get; set; }
        public DateTime? setdat { get; set; }
        public string? broker { get; set; }
        
        public decimal? qty { get; set; }
        public decimal? price { get; set; }
        public decimal? comm { get; set; }
        public string? impflg { get; set; }
        public string? reason { get; set; }
        public decimal? tax { get; set; }
        public decimal? trfchg { get; set; }
       
        public DateTime? opensetdat { get; set; }
        public decimal? local_book { get; set; }
        public decimal? local_cash { get; set; }
        public string? eomlst { get; set; }
        public string? zatts { get; set; }
        public string? xrfid { get; set; }
        public string? trx_no { get; set; }
        public string? glxcat { get; set; }
        public string? enttime { get; set; }
        public string? user_id { get; set; }
        public decimal? fxrate { get; set; }
        public string? currency { get; set; }
        public string? exch { get; set; }
        public string? opnid { get; set; }
        
        public decimal? base_book { get; set; }
        public decimal? base_cash { get; set; }
        public string? user_ref { get; set; }
        public string? long_short { get; set; }
        public string? taxlot_id { get; set; }
        public string? first_trx { get; set; }
        public string? subunit { get; set; }
        public decimal? origface { get; set; }
        public string? Class { get; set; }
        public decimal? lunreal { get; set; }
        public decimal? bunreal { get; set; }
        public string? tccom { get; set; }
        public string? tctrf { get; set; }
        public string? maker { get; set; }
        public string? manual { get; set; }
        public string? source { get; set; }
        public string? div_type { get; set; }
        public DateTime? exdate { get; set; }
        public DateTime? val_date { get; set; }
        public string? rev_audit { get; set; }
        public DateTime? re_date { get; set; }
        public string? re_brkr { get; set; }
        public decimal? oid { get; set; }
        public decimal? noid { get; set; }
        public int trxcur_no1 { get; set; }
        public string? set_curr { get; set; }
        public string? prfund { get; set; }
        public int prid { get; set; }
        public string? taxcod { get; set; }
        public DateTime? inc_nxtpay { get; set; }
        public DateTime? recdate { get; set; }
        public decimal? lcl_gross { get; set; }
        public decimal? rec_amt { get; set; }
        public string? net { get; set; }
        public decimal? with_rate { get; set; }
        public decimal? reclaim { get; set; }
        public string? old_method { get; set; }
        public string? protect { get; set; }
        public decimal? revtax { get; set; }
        public string? lei { get; set; }
        public string? uti { get; set; }
        public string? exec_time { get; set; }
        public string? conf_time { get; set; }
        public DateTime? exec_date { get; set; }
        public decimal? bmargin { get; set; }
        public decimal? lmargin { get; set; }
        public string? version { get; set; }
        public string? auttrx_no { get; set; }
        public decimal? nav_basis { get; set; }
        public DateTime? nav_date { get; set; }
        public decimal? split_num { get; set; }
        public decimal? split_den { get; set; }
        public string? optref { get; set; }
        public string? option_id { get; set; }
        public DateTime? opnset { get; set; }
        public string? inkind { get; set; }
        public decimal? hash { get; set; }
    }
}
