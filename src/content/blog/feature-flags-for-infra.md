---
title: Feature Flags In GitOps
excerpt: Feature flags have become a very popular way to control how your application behaves in real time without having to manually go update a config file or change an environment variable. Why has this same convenince not come to the infrastructure layer?
publishDate: 'May 6 2024'
isFeatured: false
tags:
  - Project
  - Kubernetes
seo:
  image:
    src: '/golang-pointers-seo.webp'
    alt: Representation of references
---

Feature flags have been a growing trend in software development over the last few years and have been a great tool to improve reliability and make it easier for developers to operate their applications more efficiently. However on the DevOps side for managing the deployments and infrastructure the user experience has not really advanced passed configuration files. Sure there are some tools out there that aim to make these config files a little smarter with tools like Helm offering a template engine and Kustomize allowing for override layers and patch files but it doesn't solve the core problem that the only way to make a change is to update the config file.

I had thought about this problem for a while and wanted to find a way to integrate feature flagging into these GitOps and Infrastructure as Code (IaC) flows and what I came up with was [FlagOps](https://github.com/graytonio/flagops/). It essentially works as a template engine like Helm but with some special functionality to pull values from feature flag providers like Flagsmith and Launch Darkly.

As of now I've used it to build my homelab up again and exposing some of the configurations like the base domain, the storage classes, and the configuration of my custom dns records from files in the repo to feature flags I can configure and deploy from a nice UI. The ability to configure these features from a UI and see at a glance what environments and what conditions each feature turns on makes it a breeze to not only make these configurations but it has even made it easier to debug issues because I can start by looking at my flags and see which applications may have something turned on when it shouldn't be.

As an example one of the feature I have configured is using longhorn as my default storage class. For some background [longhorn](https://longhorn.io/) is a bare metal distributed storage solution for kubernetes essentially allowing you to use your nodes storage like cloud native storage. The other important detail is I run my kubernetes cluster myself on some servers I have in a co-location and I don't currently have the budget to run a dedicated "staging" cluster so when I need to develop and test things I usually spin up a cluster on my laptop and work from there. One issue with this is longhorn doesn't work so well on a local laptop cluster because of some bugs that I won't get into so I needed a way that when I spin up my deployments on my laptop it will use the default storage class but in production it will use longhorn. FlagOps was able to solve this for me pretty easily.

I have a helm chart that deploys longhorn and it has a value that determines if it should be used as the default storage class.

```yaml
# https://github.com/graytonio/homelab-flagops-templates/blob/main/apps/longhorn/values.yaml#L1C1-L3C60

longhorn:
  persistence:
    defaultClass: [{ env "longhorn_storageclass_enabled" }]
```

And in my feature flag provider, in my case flagsmith I have this feature enabled in production and disabled in dev.

![Feature Flag Comparison](/feature-flags-for-infra/feature-compare.png)

So on my laptop the environment is development and my actual cluster is production. When I first launched it I was getting errors that storage could not be allocated and I was confused as to why this could be but I checked my longhorn flags and noticed that I haden't enabled the production flag and as soon as I did, like magic everything was able to work again.

This is a pretty simple example of using this tool and it's still in early development as a side project but I can see really big uses for this. Especially when paired with ArgoCD it can be used to support an entire platform for deploying applications where all a developer has to do is add their apps image to a list and set some flags in the portal and they can fully control the deployment lifecycle of their application.

I'm really excited about how this tool can be used and what other use cases it can be applied to so if this sounds interesting and you want to contribute please [check out the project](https://github.com/graytonio/flagops/) on github, try out the tool and open some feature requests or bug reports.
