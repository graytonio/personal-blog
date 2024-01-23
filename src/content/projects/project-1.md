---
title: 'Servarr Operator'
description: Servarr Operator is a kubernetes operator build to deploy and manage the open source servarr applications.
publishDate: 'Jan 23 2024'
isFeatured: true
seo:
  image:
    src: '/servarr_d_text_1024.png'
    alt: Project preview
---

![Project preview](/servarr_d_text_1024.png)

[Repository](https://github.com/graytonio/servarr-operator)

**Project Overview:**
Servarr Operator was a learning project I started to help me learn how to create kubernetes operators. I wanted something that was somewhat complex and went beyond the basic tutorials found for operator sdks.

## Objectives

1. Deploy each of the main applications for servarr
2. Configure each to connect to a postgresql server as it's db

## Technology

- [Kubebuilder](https://book.kubebuilder.io/) as a framework for the operator
- [Kind](https://kind.sigs.k8s.io/) to test the operator locally

## Outcome

I developed the operator over a few streams and was very successfuly in my first goal of being able to deploy each application and give it some basic configuration like ports and pvcs. However as I began diving deeper into how to configure them to connect to the databse the project creeped outside what I wanted to show on stream and so it has become a back burner project for me. In the future I want to revisit it and finish up the initial features but there were other more important projects for me to work on.
