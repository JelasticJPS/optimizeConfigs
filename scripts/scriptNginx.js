import com.hivext.api.environment.Environment;
import com.hivext.api.environment.File;

var Appid = hivext.local.getParam("TARGET_APPID"),
    sNginxConf = "/etc/nginx/nginx.conf",
    aCheckCPUCores = "[{\"command\": \"grep -c vendor_id /proc/cpuinfo\"}]",//"[{\"command\": \"grep processor /proc/cpuinfo | tail -n 1\"}]"
    oResp,
    aNodes,
    aCPBLNodes,
    iCores,
    sCpuInfo,
    oEnvService,
    oFileService;

oEnvService = hivext.local.exp.wrapRequest(new Environment(Appid, session));
oFileService = hivext.local.exp.wrapRequest(new File(Appid, session));
oEnvInfoResp = toNative(oEnvService.getEnvInfo());

if (oEnvInfoResp.result != 0) {
    return oEnvInfoResp;
}

aNodes = oEnvInfoResp.nodes;

aCPBLNodes = aNodes.filter(function (item) {
    return !!((item.nodeType == "nginx") || (item.nodeType == "nginxphp"));
});

aCPBLNodes.forEach(function(item, i) {

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
    oResp = oFileService.replaceInBody({
        "path": sNginxConf,
        "pattern": "worker_processes .*",
        "replacement": "worker_processes  " + iCores + ";",
        "nodeType": item.nodeType,
        "nodeid": item.id
    });

    if (oResp.result != 0) {
        return oResp;
    }

    oResp = toNative(oEnvService.restartNodeById({
        "nodeId": item.id
    }));

    if (oResp.result != 0) {
        return oResp;
    }
});

return {
    result: 0
};