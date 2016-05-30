#!/bin/bash
PARAM_NAME=$1;
PARAM_VALUE=$2;

checkParam=$(cat /opt/tomcat/conf/server.xml | grep 'Connector port="8080"' | grep ${PARAM_NAME})


sed -i -E 's/(.*)(connectionTimeout=")([0-9a-zA-Z]*)(")/\1\210000\4/' /opt/tomcat/conf/server.xml | grep connectionTime | tail -n 1
if [ -z "${checkParam}" ]
then
sed -i 's|Connector port=\"8080\"|Connector port=\"8080\" '${PARAM_NAME}'=\"'${PARAM_VALUE}'\"|g' /opt/tomcat/conf/server.xml
else
sed -i -E 's/(Connector port="8080")(.*)('${PARAM_NAME}'=")([0-9a-zA-Z]*)(")/\1\2\3'${PARAM_VALUE}'\5/' /opt/tomcat/conf/server.xml | grep 'port=\"8080\"'
fi