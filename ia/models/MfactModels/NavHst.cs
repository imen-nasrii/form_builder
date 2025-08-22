using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Linedata.Mfact.Shared.Domain.MfactModels
{
    public class NavHst
    {
        public string? fund { get; set; }
        public DateTime? dated { get; set; }
        public decimal? assets { get; set; }
        public decimal? liability { get; set; }
        public decimal? capital { get; set; }
        public decimal? revenues { get; set; }
        public decimal? expenses { get; set; }
        public decimal? shares { get; set; }
        public decimal? setldshare { get; set; }
        public decimal? net_value { get; set; }
        public string? @class { get; set; }
        public decimal? income { get; set; }
        public string? user_id { get; set; }
        public DateTime? entry_date { get; set; }
        public string? entry_time { get; set; }
        public int? status { get; set; }
        public decimal? longmktval { get; set; }
        public decimal? sht_mktval { get; set; }
        public decimal? cap_percnt { get; set; }
        public decimal? rev_percnt { get; set; }
        public decimal? exp_percnt { get; set; }
        public string? fill { get; set; }
        public string? final { get; set; }
        public string? curncy { get; set; }
        public decimal? fxrate { get; set; }
        public int? convmthd { get; set; }
        public decimal? finitcap { get; set; }
        public decimal? cinitcap { get; set; }
        public string? indic { get; set; }
        public decimal? exp_cls { get; set; }
        public decimal? exp_grp { get; set; }
        public decimal? exp_fnd { get; set; }
        public decimal? rev_cls { get; set; }
        public decimal? rev_grp { get; set; }
        public decimal? rev_fnd { get; set; }
        public decimal? cap_cls { get; set; }
        public decimal? cap_grp { get; set; }
        public decimal? cap_fnd { get; set; }
        public decimal? bas_nvps { get; set; }
        public decimal? lcl_nvps { get; set; }
        public DateTime? incomedate { get; set; }
        public string? ae_final { get; set; }
        public decimal? bas_aps { get; set; }
        public string? allocnav { get; set; }
        public string? supervisor { get; set; }
        public string? team_lead { get; set; }
        public string? accountant { get; set; }
        public decimal? mktval { get; set; }
        public decimal? cstval { get; set; }
        public decimal? mkttnav { get; set; }
        public decimal? mktsnav { get; set; }
        public decimal? displaynav { get; set; }
        public decimal? basnav { get; set; }
        public decimal? lclnav { get; set; }
        public decimal? lcl_net_value { get; set; }
        public int? hash { get; set; }
    }

}
