using Microsoft.SharePoint.Client;
using Microsoft.SharePoint.Utilities;
using System.IO;

namespace SharePointJungs.SuiteNavExtender
{
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
}
