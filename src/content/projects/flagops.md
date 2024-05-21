---
title: FlagOps
description: Integrating feature flags into GitOps and IaC workflows
publishDate: 'May 17 2024'
isFeatured: true
seo:
  image:
    src: '/flagops.webp'
    alt: FlagOps
---

![Project Preview](/flagops.webp)

[Repository](https://github.com/graytonio/flagops)

**Project Overview**
FlagOps was built to be able to integrate feature flagging into GitOps projects for kubernetes and Terraform that would allow teams to control rollouts in the same way application teams do.

## Objectives

1. Instrument a helm chart or terraform variables file with a feature flag
2. Integrate the tool with CD tools like ArgoCD so the connection is seamless

## Outcome

The project was a great success and I was able to rebuild my homelab with it. I can now safely control the rollout of new features and potentially breaking changes with the click of a button. It also has the additional benefit of giving me great visibility into what I have configured instead of looking through endless yaml files. I wrote an article on the technology to give it some more context [here](https://www.graytonward.com/blog/feature-flags-for-infra/).
