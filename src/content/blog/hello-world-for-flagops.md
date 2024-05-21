---
title: Getting Started with FlagOps
excerpt: A getting started guide to instrumenting your GitOps projects with feature flags.
publishDate: 'May 19 2024'
isFeatured: false
tags:
  - Project
  - Kubernetes
  - FlagOps
seo:
  image:
    src: '/feature-flags-for-infra/seo-image.webp'
    alt: Representation of references
---

FlagOps allows you to integrate feature flagging into your GitOps deployments giving easier control over feature rollouts and configuration. In this guide, I will walk you through setting up a basic GitOps project using Helm, ArgoCD, and FlagOps to be able to orchestrate your deployments with feature flags. You can read more about the background of FlagOps [here](https://www.graytonward.com/blog/feature-flags-for-infra/)

## Prerequisites

To follow this guide you will need:

1. A kubernetes cluster - Can be kind, bare metal, or hosted on a cloud provider.
2. ArgoCD deployed - Follow this [guide](https://argo-cd.readthedocs.io/en/stable/getting_started/)
3. A [Flagsmith](https://www.flagsmith.com/) Account - We will use this to create and manage our feature flags.
4. Basic knowledge of kubernetes and ArgoCD

## Setting up the ArgoCD Plugins

The first thing we need to do is install the FlagOps ArgoCD Plugin. The plugin will take our templates from our repository, inject our feature flags as template variables, and then output the resulting files to be applied to the cluster. The manifests for the installation are available in the [repo](https://github.com/graytonio/flagops/tree/main/manifests).

Before we apply the manifests we will need to modify the environment configuration under `cmp-plugin.yaml`.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: flagops-env
data:
  flagops-env.yaml: |
    envs:
      production:
        provider: flagsmith
        apiKey: <api-key>
      staging:
        provider: flagsmith
        apiKey: <api-key>
```

Here we will replace the `<api-key>` with the Flagsmith client sdk keys which can be found in the dashboard under `SKD Keys`.

![sdk-keys](/flagops-getting-started/sdk-keys.png)

Once we have added these keys we can apply the configurations by running `kustomize apply -k .` in the manifests directory.

You should now see in your k8s cluster that the ArgoCD repo server has 3 new containers that will run our plugin code.

## Setting Up the GitOps Repo

Now that ArgoCD can accept a repository with feature flags we need to create a repo for it to sync with. You can use the example setup repository [here](https://github.com/graytonio/flagops-argocd-example/blob/main/root/appset.yaml). I recommend copying this repository and using it as a base to experiment with FlagOps.

This example repo has a single application set that passes which is set up to take all the directories under `/apps` and try to apply them as helm charts by using the FlagOps plugin.

```yaml
apiVersion: argoproj.io/v1alpha1
kind: ApplicationSet
metadata:
  name: nginx-app
  namespace: argocd
spec:
  goTemplate: true
  goTemplateOptions: ['missingkey=error']
  generators:
    - matrix:
        generators:
          - git:
              repoURL: https://github.com/graytonio/flagops-argocd-example.git
              revision: HEAD
              directories:
                - path: apps/*
          # These are example clusters that we can use to create rules around our flags.
          - list:
              elements:
                - cluster: flagops-dev-use
                  url: https://kubernetes.default.svc
                - cluster: flagops-dev-usc
                  url: https://kubernetes.default.svc
                - cluster: flagops-dev-usw
                  url: https://kubernetes.default.svc
  template:
    metadata:
      name: '{{.path.basename}}-{{.cluster}}'
    spec:
      project: 'demo'
      source:
        repoURL: https://github.com/graytonio/flagops-argocd-example.git
        targetRevision: HEAD
        path: '{{.path.path}}'
        plugin:
          name: flagops-plugin-helm
          env:
            - name: FLAGOPS_ENVIRONMENT
              value: testing
            - name: FLAGOPS_PROP_OWNER
              value: graytonw
            - name: FLAGOPS_PROP_CLUSTER
              value: '{{.cluster}}'
      destination:
        server: '{{.url}}'
        namespace: '{{.path.basename}}-{{.cluster}}'
      syncPolicy:
        automated:
          prune: true
          selfHeal: true
        syncOptions:
          - CreateNamespace=true
```

The application we have configured is a simple NGINX web server with 2 important feature flags instrumented in the `values.yaml` file.

```yaml
nginx:
  # The first feature flag "nginx_replicas" controls how many pods our deployment will be running.
  replicaCount: [{ env "nginx_replicas" }]

# This feature flag "demo_app" controls if the pod should clone the example application before launching.
[{- if env "demo_app_enabled" }] # The flag is using the "_enabled" syntax to look up a flag called "demo_app" and parse it as a boolean
  cloneStaticSiteFromGit:
    enabled: true
    repository: https://github.com/mdn/beginner-html-site-styled.git
    branch: master
[{- end }]
```

In the next section, we will create these feature flags in Flagsmith so that we can control both of these parameters from the dashboard.

## Creating the Feature Flags

The last step before we can deploy our applications to ArgoCD is we need to create the feature flags in the Flagsmith dashboard.

The first flag `nginx_replicas` can be created with a default value of 1

![nginx-feature](/flagops-getting-started/replicas-feature.png)

And the second flag `demo_app` does not need a default value.

![demo-feature](/flagops-getting-started/demo-feature.png)

## Deploying the app

Now that all the setup is done we can finally connect ArgoCD to our GitOps repository. We will add an application and configure it to pull the manifests from our repository by clicking on the `New App` button in our dashboard. For this example we will use the [example](https://github.com/graytonio/flagops-argocd-example) repo which deploys 3 nginx web servers with some associated metadata to show off how we can take advantage of FlagOps.

You can copy and paste the yaml here to add the FlagOps demo repository as an application in ArgoCD.

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: flagops
spec:
  destination:
    name: ''
    namespace: flagops
    server: 'https://kubernetes.default.svc'
  source:
    path: root/
    repoURL: 'https://github.com/graytonio/flagops-argocd-example.git'
    targetRevision: HEAD
  sources: []
  project: demo
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

You should see that the root application is created along with the three deployments of NGINX for each of our configured "clusters".

![argo-dashboard](/flagops-getting-started/argo-dashboard.png)

## Controlling Features

Now that it is deployed we can go back to our dashboard and start updating some features. First let's start by updating how many replicas we want to be running. We can go to the features section, select our `nginx_replicas` feature, and update the value to 3.

![update-feature](/flagops-getting-started/update-replicas.png)

Once we do this we can wait for ArgoCD to automatically Hard Refresh the app or we can manually hard refresh it to apply the changes now. And once the app refreshes we should see that each application now has 3 replicas of NGINX.

![feature-update](/flagops-getting-started/feature-update.png)

Now we want to change only one application's values without changing them all. We can do this by going to our identities page and choosing one of our applications to update. You'll see each identity matches up with an application and has some traits that help us get some information about the deployment.

![identity-dashboard](/flagops-getting-started/identity.png)

These are some basic examples but they can be easily expanded through the appset.

We can select the `nginx_replicas` again and update the value for this application to 5.

![update-user-feature](/flagops-getting-started/update-user-feature.png)

After saving and refreshing we should see again that only the application we picked was scaled up to 5 replicas.

![user-update](/flagops-getting-started/user-update.png)

This is all great but the real power is when we start applying rules with Segments. Segments are a tool in Flagsmith that allows you to override feature flag values based on rules about the traits we saw earlier. We won't be going too far in depth about segments right now but if you want to learn more you can read the [documentation](https://docs.flagsmith.com/basic-features/segments).

For our purposes, we want to create a segment which any application deployed in a certain region will have the `demo_app` feature disabled. First, we need to create a new segment and add a rule for the cluster to be a specific value. The "clusters" that the applications are in can be found in their identities.

![new-segment](/flagops-getting-started/new-segment.png)

Once it has been created we can update our production overrides to disable the `demo_app` feature.

![update segment feature](/flagops-getting-started/update-seg-feature.png)

Once again after saving and refreshing, you can see that the application in the region we specified does not have the repo sync container like the other ones do.

![demo-on](/flagops-getting-started/demo-on.png)

![demo-off](/flagops-getting-started/demo-off.png)

## Next Steps

This has been a very basic setup for applying FlagOps to your deployment system but it can be extended to much more complex setups depending on your organization's needs. If you need help with any kind of setup feel free to open an issue to the FlagOps [repo](https://github.com/graytonio/flagops).
