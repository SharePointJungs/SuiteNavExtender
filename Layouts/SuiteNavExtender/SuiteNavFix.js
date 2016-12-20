SP.SOD.executeFunc('suitenav.js', '_o365sg2c._navMenuMouseRenderer.renderLauncher', replaceFunction);
function replaceFunction() {
    // Cache für die Navigation leeren
    ClearSuiteLinksCache();

    _o365sg2c._navMenuMouseRenderer.renderLauncher = function (i) {
        var h;
        if (_o365sg2c.O365Shell._$$pf_ShellData$p.PinnedApps)
            h = _o365sg2c.O365Shell._$$pf_ShellData$p.PinnedApps;
        else {
            var c = [];
            if (_o365sg2c.O365Shell._$$pf_ShellData$p.WorkloadLinks) {
                var o;
                c = (o = c).concat.apply(o, _o365sg2c.O365Shell._$$pf_ShellData$p.WorkloadLinks);
            }
            if (_o365sg2c.O365Shell._$$pf_ShellData$p.AppsLinks) {
                var p;
                c = (p = c).concat.apply(p, _o365sg2c.O365Shell._$$pf_ShellData$p.AppsLinks);
            }
            if (_o365sg2c.O365Shell._$$pf_ShellData$p.AdminLink)
                c = c.concat(_o365sg2c.O365Shell._$$pf_ShellData$p.AdminLink);
            if (_o365sg2c.O365Shell._$$pf_ShellData$p.PartnerLink)
                c = c.concat(_o365sg2c.O365Shell._$$pf_ShellData$p.PartnerLink);
            h = new Array(0);
            for (var m = c, r = m.length, j = 0; j < r; ++j) {
                var d = m[j], a = {};
                a.Id = d.Id;
                a.Title = d.Text;
                a.AriaLabel = d.Title;
                a.BrandBarText = d.BrandBarText;
                a.IconFullUrl = d.IconFullUrl;
                if (!a.IconFullUrl) {
                    a.FontIconCss = "wf-o365-" + _o365sg2cm.ShellCoreMinIcons.getTileIcon(d.Id, _o365sg2c.O365Shell._$$pf_ClientData$p.IsConsumerShell)._$$pf_Name$p$0;
                }
                a.TargetWindow = d.TargetWindow;
                a.BackgroundColor = _o365sg2cm.ShellCoreMinIcons.getTileBackgroundColor(d.Id, _o365sg2c.O365Shell._$$pf_ClientData$p.IsConsumerShell);
                a.LaunchFullUrl = d.Url;
                h.push(a);
            }
        }
        for (var e = null, n = h, s = n.length, k = 0; k < s; ++k) {
            var a = n[k];
            a.Size = !_o365su.ScriptUtils.isNullOrUndefined(a.Size) ? a.Size : 2;
            if (a.Size === 1) {
                if (a.IsNewGroup || !e) {
                    e = document.createElement("div");
                    e.className = "o365cs-nav-appItem o365cs-nav-appItemGroup";
                    i.appendChild(e);
                }
            }
            else
                e = null;
            _o365sg2c._navMenuMouseRenderer._renderTileElement$p(e || i, a);
            if (a.Id === _o365sg2c.O365Shell._$$pf_ShellData$p.CurrentMainLinkElementID || "Shell" + a.Id === _o365sg2c.O365Shell._$$pf_ShellData$p.CurrentMainLinkElementID)
                _o365sg2c._o365BrandingMouseRenderer._$$pf_AppHeaderLink$p = a;
        }
        if (!_o365sg2c._o365BrandingMouseRenderer._$$pf_AppHeaderLink$p && _o365sg2c.O365Shell._$$pf_ClientData$p.AppHeaderLinkText) {
            var f = {};
            f.Id = "ShellAppHeader";
            f.Title = _o365sg2c.O365Shell._$$pf_ClientData$p.AppHeaderLinkText;
            f.LaunchFullUrl = _o365sg2c.O365Shell._$$pf_ClientData$p.AppHeaderLinkUrl;
            _o365sg2c._o365BrandingMouseRenderer._$$pf_AppHeaderLink$p = f;
        }
        if (_o365sg2c.O365Shell._$$pf_ClientData$p.MyAppsUrl) {
            var g = document.createElement("div");
            g.className = "o365cs-nav-navMenuMyApps";
            var b = _o365sg2c._controls.link();
            b.id = "ShellMyApps";
            _o365sg2c._domElementExtensions.addClass(b, "o365cs-nav-navMenuMyAppsLink ms-fcl-tp ms-fcl-ts-h");
            _o365sg2c._domElementExtensions.toggleClass(b, "o365cs-topnavText", _o365sg2c.O365Shell._$$pf_ClientData$p.ShowNewAppLauncher);
            _o365sg2c._domElementExtensions.href(b, _o365sg2c.O365Shell._$$pf_ClientData$p.MyAppsUrl);
            _o365sg2c._domElementExtensions.target(b, "_top");
            var q = _o365sg2c._controls.icon(_o365sg2cm.ShellCoreMinIcons.myApps);
            _o365sg2c._domElementExtensions.addClass(q, "o365cs-nav-navMenuMyAppsLinkIcon");
            b.appendChild(q);
            var l = document.createElement("span");
            l.className = "o365cs-nav-navMenuMyAppsLinkText";
            _o365sg2c._domElementExtensions.text(l, _s1.ShellG2Strings.l_ShellCore_NavMenu_MyApps_Text);
            b.appendChild(l);
            _o365sg2c._domElementExtensions.click(b, function () {
                _o365sg2c.O365Shell._logLinkClicked$i(b.id);
            }, false);
            _o365sg2c._navMenuMouseRenderer._setTabHandling$p(i, g, b);
            g.appendChild(b);
            i.appendChild(g);
        }
        O365.Log.writeShellLog(401057, 1, 1, 0);
    };
}