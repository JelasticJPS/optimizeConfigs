import com.hivext.api.environment.Environment;
import com.hivext.api.environment.File;

var Appid = hivext.local.getParam("TARGET_APPID"),
    aCheckCPUCores = "[{\"command\": \"grep -c vendor_id /proc/cpuinfo\"}]",
    //sGetRamInfo = "[{\"command\": \"rev /proc/meminfo | grep latoTmeM | cut -c 4- | rev | cut -c 19-\"}]",//rev /proc/meminfo | grep latoTmeM | cut -c 4- | rev | cut -c 19-
    sGetRamInfo = [{"command": "cat /proc/meminfo | grep MemTotal | awk \'{print $2}\'"}],
    sKeysPath = "/var/lib/jelastic/keys/",
    nRam,
    oResp,
    sCpuInfo,
    iCores,
    nAcceptCount,
    aNodes,
    aCPBLNodes,
    oReadResp,
    oEnvService,
    oFileService;

oEnvService = hivext.local.exp.wrapRequest(new Environment(Appid, session));
oFileService = hivext.local.exp.wrapRequest(new File(Appid, session));

function optimizeProcess() {
    oEnvInfoResp = toNative(oEnvService.getEnvInfo());

    if (oEnvInfoResp.result != 0) {
        return oEnvInfoResp;
    }

    aNodes = oEnvInfoResp.nodes;

    aCPBLNodes = aNodes.filter(function (item) {
        return !!((item.nodeType == "tomcat6") || (item.nodeType == "tomcat7") || (item.nodeType == "tomcat8"));
    });

    aCPBLNodes.forEach(function (item, i) {

        sCpuInfo = toNative(oEnvService.execCmd({
            "nodeType": item.nodeType,
            "commandList": aCheckCPUCores,
            "nodeid": item.id
        }));
        if (sCpuInfo.result != 0) {
            return sCpuInfo;
        }

        iCores = sCpuInfo.responses[0].out;
        iCores = iCores.replace("\n","");

        nAcceptCount = iCores * 128;


        oResp = toNative(oEnvService.execCmd({
            "nodeType": item.nodeType,
            "commandList": toJSON(sGetRamInfo),
            "nodeid": item.id
        }));
        
        
        
        
        //return 1+oResp;
        if (oResp.result != 0) {
            return oResp;
        }
/*
        oReadResp = toNative(oFileService.upload({
            "destPath": "/var/lib/jelastic/keys/installScript.sh",
            "nodeType": item.nodeType,
            "sourcePath": "https://raw.githubusercontent.com/jelastic-jps/optimizeConfigs/master/scripts/script_prev.sh"
        }));
*/
        nRam = Math.floor(oResp.responses[0].out);

        oReadResp = toNative(oFileService.upload({
            "destPath": "/var/lib/jelastic/keys/installScript.sh",
            "nodeType": item.nodeType,
            "sourcePath": "https://raw.githubusercontent.com/jelastic-jps/optimizeConfigs/master/scripts/script.sh"
        }));


        oResp = toNative(oEnvService.execCmd({
            "nodeType": item.nodeType,
            "commandList": toJSON([{"command": "/bin/bash " + sKeysPath + "installScript.sh 'maxThreads' '" + nAcceptCount + "' > /tmp/intallAddOn.log"}])
        }));

        if (oResp.result != 0) {
            return oResp;
        }

        oResp = toNative(oEnvService.execCmd({
            "nodeType": item.nodeType,
            "commandList": "[{\"command\": \"/bin/bash " + sKeysPath + "installScript.sh 'acceptCount' '" + nAcceptCount + "' > /tmp/intallAddOn.log\"}]"
        }));

        if (oResp.result != 0) {
            return oResp;
        }

        oResp = toNative(oEnvService.execCmd({
            "nodeType": item.nodeType,
            "commandList": "[{\"command\": \"/bin/bash " + sKeysPath + "installScript.sh 'maxConnections' '" + nRam/1024*16 + "' > /tmp/intallAddOn.log\"}]"
        }));

        if (oResp.result != 0) {
            return oResp;
        }

        oResp = toNative(oEnvService.execCmd({
            "nodeType": item.nodeType,
            "commandList": "[{\"command\": \"/bin/bash " + sKeysPath + "installScript.sh 'processorCache' '" + nAcceptCount + "' > /tmp/intallAddOn.log\"}]"
        }));

        if (oResp.result != 0) {
            return oResp;
        }

        oResp = toNative(oEnvService.execCmd({
            "nodeType": item.nodeType,
            "commandList": "[{\"command\": \"/bin/bash " + sKeysPath + "installScript.sh 'tcpNoDelay' 'true' > /tmp/intallAddOn.log\"}]"
        }));

        if (oResp.result != 0) {
            return oResp;
        }

        oResp = toNative(oEnvService.execCmd({
            "nodeType": item.nodeType,
            "commandList": "[{\"command\": \"rm -rf " + sKeysPath + "installScript.sh\"}]"
        }));

        if (oResp.result != 0) {
            return oResp;
        }
    });

    return oResp || {result: 0};
}

return optimizeProcess();