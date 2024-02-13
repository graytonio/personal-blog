---
title: The Illusion of Clean Code
excerpt: Clean code is a hotly debated topic in developer circles however I think most of this discourse is pointless. There is no such thing as a universal "clean code"
publishDate: 'Jan 24 2024'
isFeatured: true
tags:
  - Rant
  - Style
seo:
  image:
    src: '/post-1.jpg'
    alt: A person standing at the window
---

I've seen countless articles and videos on "Clean Code" the idea that code styling should always be written in a way that is "readable" and "maintainable". These seem like reasonable enough claims, no one wants to open up a code base and see a pile of cryptic function calls with mysterious side effects and be asked to fix a bug.

The problem I see in most of these guide on clean code is that most of them have very arbitrary measures of what makes something "clean", metrics like lines of code in a function or following a specific `{verb}{noun}` function naming convention or some other static analysis rule. These rules are applied and followed and by doing that you can measure and declare by some metric that your code is good. But this misses the entire point of "clean" code because you are never measuring how easy it is for the team working on the project to maintain the code or add new features.

## My Clean != Your Clean

The main point I want to be able to get across in this article is that you can't look at a medium article or even a full book written by someone else outside your team and declare that it should be the style guide without any further thought.
