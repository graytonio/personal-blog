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

Feature flags have been a growing trend in software development over the last few years and have been a great tool to improve reliability and make it easier for developers to operate their applications more efficiently. However, on the DevOps side, the user experience of managing GitOps-based deployments and infrastructure has not really advanced passed editing configuration files. Sure there are some tools out there that aim to make these configs a little smarter with tools like Helm offering a template engine and Kustomize allowing for override layers and patch files, but it doesn't solve the core problem that the only way to make a change is to change a specifically formatted file.

I had thought about this problem for a while and wanted to find a way to keep the auditability of GitOps and combine it with the user experience of feature flags when it came to managing GitOps and Infrastructure as Code (IaC). What I came up with was [FlagOps](https://github.com/graytonio/flagops/), it is a template engine that allows [OpenFeature](https://openfeature.dev/) compatible services to act as inputs to generate GitOps and IaC repositories. By using a spec like OpenFeature I got a lot of benefits for free like complex override layers, identities, and auditability of changes. As a bonus an organization that's already using applicative feature flags can use the same system for these infrastructure flags.

As of now I've used it to build my home lab up again and expose some of the configurations like the base domain, the storage classes, and the configuration of my custom DNS records from files in the repo to feature flags I can configure from a nice UI without losing the audit trail in git. It has even helped me debug issues by allowing me to see a refined set of possible changes that I could have made and compare between the staging environment that isn't working and the production environment that is.

As an example, one of the features I have configured is using Longhorn as my default storage class. For some background [longhorn](https://longhorn.io/) is a distributed storage solution for bare metal Kubernetes essentially allowing you to use your node's storage like cloud native storage. The other important detail is I run my Kubernetes cluster in a co-location and I don't currently have the budget to run a dedicated "staging" cluster. So when I need to develop and test things I usually spin up a kind cluster on my laptop and work from there. One issue with this is Longhorn doesn't work so well on a kind cluster because of some [limitations with kind](https://github.com/longhorn/longhorn/discussions/2702) so I needed a way that when I spin up my deployments on my laptop it will use the default storage class but in production it will use longhorn. FlagOps was able to solve this for me pretty easily.

I have a helm chart that deploys Longhorn and it has a value that determines if it should be used as the default storage class.

```yaml
# https://github.com/graytonio/homelab-flagops-templates/blob/main/apps/longhorn/values.yaml#L1C1-L3C60

longhorn:
  persistence:
    defaultClass: [{ env "longhorn_storageclass_enabled" }]
```

And in my feature flag provider, in my case [Flagsmith](https://www.flagsmith.com/) I have this feature enabled in production and disabled in dev.

![Feature Flag Comparison](/feature-flags-for-infra/feature-compare.png)

So on my laptop, the environment is development and my actual cluster is production. When I first launched it I was getting errors that storage could not be allocated and I was confused as to why this could be but I checked my Longhorn flags and noticed that I hadn't enabled the production flag and as soon as I did, like magic, everything was able to work again.

This is a pretty simple example of using this tool and it's still in early development as a side project but I can see really big uses for this. Especially when paired with ArgoCD it can be used to support an entire platform for deploying applications where all a developer has to do is add their app's image to a list and set some flags in the portal and they can fully control the deployment lifecycle of their application.

I'm really excited about how this tool can be used and what other use cases it can be applied to so if this sounds interesting and you want to contribute please [check out the project](https://github.com/graytonio/flagops/) on GitHub, try out the tool and open some feature requests or bug reports.
