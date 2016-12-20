# SuiteNavExtender

Auch wenn es mit dem neuesten Feature Pack möglich ist die Einträge im AppLauncher zu erweitert (siehe dazu diesen Beitrag), möchte ich in diesem Beitrag einen alternativen Ansatz vorstellen, mit dem auch weitere Bereiche der oberen SuiteBar erweitert werden können, wie zum Beispiel die Links unter dem Benutzernamen.

Hierzu wird ein REST-Service erstellt, der einen JSON string zurück gibt in dem beschrieben steht, welche Einträge angezeigt werden sollen. Mit dieser Vorgehensweise wird der Standard von SharePoint durch unsere eigene Konfiguration überschrieben.

Zunächst erstellen wir ein neues SharePoint-Projekt (FarmSolution). Diesem fügen wir die zwei Klassen **SuiteNavExtenderServiceStub** (abgeleitet von ServerStub ([MSDN](https://msdn.microsoft.com/en-us/library/microsoft.sharepoint.client.serverstub.aspx)) und **SuiteNavExtenderService**  hinzu.

## SuiteNavExtenderServiceStub.cs

In dieser Klasse werden grundsätzliche Informationen für den Service hinterlegt und müssen zu der restlichen Definition des Services passen, was insbesondere für die GUID und den FullName gilt, die nach einer Änderung in der Service-Klasse gerne mal vergessen werden.

``` cs
[ServerStub(
    typeof(SuiteNavExtenderService),
    TargetTypeId = "{8AE98184-E986-4E62-8CE7-630EEEC08218}")]
public class SuiteNavExtenderServiceStub : ServerStub
{
    protected override Type TargetType => typeof(SuiteNavExtenderService);

    protected override Guid TargetTypeId => new Guid("{8AE98184-E986-4E62-8CE7-630EEEC08218}");

    protected override string TargetTypeScriptClientFullName => "SharePointJungs.SuiteNavExtender";

    protected override ClientLibraryTargets ClientLibraryTargets => ClientLibraryTargets.All;

    protected override object InvokeConstructor(XmlNodeList xmlargs, ProxyContext proxyContext)
    {
        CheckBlockedMethod(".ctor", proxyContext);
        return new SuiteNavExtenderService();
    }

    protected override object InvokeConstructor(ClientValueCollection xmlargs, ProxyContext proxyContext)
    {
        CheckBlockedMethod(".ctor", proxyContext);
        return new SuiteNavExtenderService();
    }

    protected override object InvokeMethod(object target, string methodName, ClientValueCollection xmlargs, ProxyContext proxyContext, out bool isVoid)
    {
        SuiteNavExtenderService service = (SuiteNavExtenderService)target;

        methodName = GetMemberName(methodName, proxyContext);

        switch (methodName)
        {
            case "Empty":
                isVoid = true;
                return null;
            case "GetSuiteNavData":
                isVoid = true;
                return service.GetSuiteNavData();
        }

        return base.InvokeMethod(target, methodName, xmlargs, proxyContext, out isVoid);
    }

    protected override IEnumerable<MethodInformation> GetMethods(ProxyContext proxyContext)
    {
        MethodInformation methodGetString = new MethodInformation
        {
            Name = "GetSuiteNavData",
            IsStatic = false,
            OperationType = OperationType.Default,
            ClientLibraryTargets = ClientLibraryTargets.All,
            OriginalName = "GetSuiteNavData",
            WildcardPath = false,
            ReturnType = typeof(string),
            ReturnODataType = ODataType.Primitive,
            RESTfulExtensionMethod = true,
            ResourceUsageHints = ResourceUsageHints.None,
            RequiredRight = ResourceRight.Default
        };
        yield return methodGetString;

        MethodInformation methodCtor = new MethodInformation
        {
            Name = ".ctor",
            IsStatic = false,
            OperationType = OperationType.Default,
            ClientLibraryTargets = ClientLibraryTargets.RESTful,
            OriginalName = ".ctor",
            WildcardPath = false,
            ReturnType = null,
            ReturnODataType = ODataType.Invalid,
            RESTfulExtensionMethod = false,
            ResourceUsageHints = ResourceUsageHints.None,
            RequiredRight = ResourceRight.None
        };
        yield return methodCtor;
    }
}
```
## SuiteNavExtenderService.cs 

In dieser Klasse wird die eigentliche Funktionalität geboten. Um die Konfiguration zunächst möglichst einfach zu halten wird der Inhalt einer JSON-Datei geladen, die im Layouts-Verzeichnis des SharePoint abgelegt wird. Die Funktion kann von diesem Beispiel ausgehen erweitert werden, so dass Konfigurationen dynamischer geladen werden, wenn diese zum Beispiel speziell berechtigte Verknüpfungen darstellen sollen.

``` cs 
[ClientCallableType(
    Name = "SuiteBarService", 
    ServerTypeId = "{8AE98184-E986-4E62-8CE7-630EEEC08218}")]
public class SuiteNavExtenderService
{
    /// <summary>
    /// Liefert die Daten für den Aufbau der oberen Navigationsleiste
    /// </summary>
    /// <returns>Daten im benötigten JSON-Format</returns>
    [ClientCallableMethod(
        RequiredRight = ResourceRight.None, 
        ClientLibraryTargets = ClientLibraryTargets.RESTful, 
        Name = "GetSuiteNavData", 
        OperationType = OperationType.Read)]
    public string GetSuiteNavData()
    {
        // JSON aus Datei im "_layouts"-Verzeichnis laden
        string path = SPUtility.GetCurrentGenericSetupPath(@"TEMPLATE\LAYOUTS\SuiteNavExtender\SuiteNavExtenderData.json");
        using (TextReader reader = new StreamReader(path))
        {
            return reader.ReadToEnd();
        }
    }
}
```

Nachdem die zwei Klassen erstellt wurden, müssen diese im SharePoint noch bekannt gemacht werden. Hierzu wird über Rechtsklick auf das Projekt und Add -> SharePoint Mapped Folder der Ordner "ClientCallable" hinzugefügt.

<SCREENSHOT EINFÜGEN>

In diesem fügen wir die XML-Datei ProxyLibrary.SharePointJungs.SuiteNavExtenderService.xml hinzu. Hierbei ist es wichtig, dass der Name der Datei mit ProxyLibrary. beginnt.
In der Datei selbst wird der Service wie folgt angegeben.

``` xml
<ClientCallableProxyLibrary>
  <AssemblyName SupportAppAuth="true">SharePointJungs.SuiteNavExtender, Version=1.0.0.0, Culture=neutral, PublicKeyToken=fba9ff59b0c7d6ba</AssemblyName>
</ClientCallableProxyLibrary>
```

Zusätzlich wird über ein neues "Empty Element" folgender Eintrag hinzugefügt:

``` xml
<?xml version="1.0" encoding="utf-8"?>
<Elements xmlns="http://schemas.microsoft.com/sharepoint/">
  <Control Id="SuiteBarDelegate"
          Sequence="50"
          ControlClass="Microsoft.SharePoint.WebControls.SuiteNavControl"
          ControlAssembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c"
          xmlns="http://schemas.microsoft.com/sharepoint/">
    <!--Dem SuiteNavControl die Rest-Methode nennen, über dir er nun die Daten laden soll-->
    <Property Name="SuiteNavRestMethod">SuiteNavExtenderService/GetSuiteNavData</Property>
  </Control>
  <!--AdditionalPageHead-->
  <Control ControlSrc="/_controltemplates/15/SuiteNavExtender/AdditionalPageHeader.ascx"
           Id="AdditionalPageHead"
           Sequence="90" />
</Elements>
```

Zum Schluss muss noch ein Eintrag in der AssemblyInfo ergänzt werden:

``` cs
[assembly: UrlSegmentAliasMap("SuiteNavExtenderService", "SharePointJungs.SuiteNavExtender", ResourceType = typeof(SuiteNavExtenderService))]
```

Damit der Service auch was zu laden hat muss noch eine entsprechende Konfiguration in das Layouts-Verzeichnis gelegt werden. Dies kann wahlweise manuell oder auch direkt über die SharePoint-Lösung erfolgen. Eine Konfiguration mit einem Element sähe wie folgt aus:

``` json
{
    "DoNotCache": true,
    "NavBarData": {
        "AboutMeLink": null,
        "ClientData": null,
        "CurrentMainLinkElementID": null,
        "CurrentWorkloadHelpSubLinks": null,
        "CurrentWorkloadSettingsSubLinks": null,
        "CurrentWorkloadUserSubLinks": null,
        "HelpLink": null,
        "IsAuthenticated": false,
        "PinnedApps": null,
        "WorkloadLinks": [{
            "AriaLabel": null,
            "BackgroundColor": null,
            "BrandBarText": null,
            "CollectorId": null,
            "FontIconCss": null,
            "IconFullUrl": "/_layouts/15/images/suitenavextender/logospj200.png",
            "Id": "Sharepointjungs",
            "IsNewGroup": false,
            "LaunchFullUrl": null,
            "Size": 0,
            "TargetWindow": null,
            "Text": "Sharepointjungs",
            "Title": "Sharepointjungs",
            "Url": "http://www.sharepointjungs.de"
        }]
    },
    "SPSuiteVersion": 2
}
```

Wie man sieht gibt es neben den "WorkloadLink" noch weitere Bereiche, auf die ich hier aber vorerst nicht näher eingehe, da es hier nur um den ersten Aufbau des Service geht.

Jetzt ist die Lösung bereit für einen ersten Testlauf im SharePoint. Hierzu die Lösung entsprechend veröffentlichen und das zugehörige Feature aktivieren. Da die SuiteLinks im Browser gecached werden kann es sein, dass nach dem Aktivieren des Feature der Browser geschlossen und neu geöffnet werden muss, damit man den gewünschten Effekt sehen kann.

In der bei der Entwicklungs verwendeten SharePoint-Version gab es leider noch Probleme mit eigenen Bildern die über "IconFullUrl" angegben werden. Diese werden nicht korrekt geladen, da im SharePoint-Standard in der Regel mit IconFonts gearbeitet wird. Hierfür wurde in der Beispiel-Lösung ein AdditionalPageHeader definiert der ein JavaScript lädt welches sich diesem Problem annimmt.