[![Optimize Configs](images/postaddon.png)](../../../optimize-configs)
## Jelastic Optimize Configs Add-on
This repository provides Optimize Configs add-on for Jelastic Platform.

**Optimize Configs** is an add-on which will increase worker proccesses on nginx nodes and increase maxThreads and maxConnections values on tomcat nodes.

**Type of nodes this add-on can be applied to**: 
- Tomcat 6
- Tomcat 7
- Tomcat 8
- Nginx PHP
- Nginx

### What it can be used for?
This Add-on will increase worker proccesses on nginx nodes and increase maxThreads and maxConnections values on tomcat nodes.<br />
Change config files on nginx & tomcat nodes (workers, connections amount, max threads amount).

### Deployment

In order to get this solution instantly deployed, click the "Get It Hosted Now" button, specify your email address within the widget, choose one of the [Jelastic Public Cloud providers](https://jelastic.cloud) and press Install.

[![GET IT HOSTED](https://raw.githubusercontent.com/jelastic-jps/jpswiki/master/images/getithosted.png)](https://jelastic.com/install-application/?manifest=https%3A%2F%2Fgithub.com%2Fjelastic-jps%2Foptimize-configs%2Fraw%2Fmaster%2Fmanifest.jps)

To deploy this package to Jelastic Private Cloud, import [this JPS manifest](../../raw/master/manifest.jps) within your dashboard ([detailed instruction](https://docs.jelastic.com/environment-export-import#import)).

For more information on what Jelastic add-on is and how to apply it, follow the [Jelastic Add-ons](https://github.com/jelastic-jps/jpswiki/wiki/Jelastic-Addons) reference.