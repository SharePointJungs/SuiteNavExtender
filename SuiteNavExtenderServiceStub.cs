using Microsoft.SharePoint.Client;
using System;
using System.Collections.Generic;
using System.Xml;

namespace SharePointJungs.SuiteNavExtender
{
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
}
