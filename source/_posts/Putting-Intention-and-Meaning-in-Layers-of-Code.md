---
categories:
  - Software Development
  - Principles
date: 2023-09-09 14:27:40
excerpt: Writing code with intention to help testing, maintainability, and separation of concerns.
tags: 
  - Architecture
  - Code Quality
  - Clean Code
title: Putting Intention and Meaning in Layers of Code
---
# Preamble
Everyone's heard of n-tier or _onion_ architecture - layering code by its technical concern (view, data, logic) and why separating them might be in your best interest. It's not often, though, that code flows so simply without traversing these layers multiple times in slightly different ways. We'll discuss strategies to help identify and isolate domains in your code that will naturally lead to more functional - and hopefully readable - code, learn some nuance which advocates breaking these layers at times.

This article is primarily aimed at your standard business applications and will reference well-known business concepts, but can be broadly applicable.

# Why Bother With Layers Anyways?
There are several reasons to layer your codebase: testability, readability, reusability to name a few. Does this mean that every logical group of code needs to be pulled out into a layer to maximize the aforementioned 'ilities?

As usual...

{% asset_img it-depends.jpg 500 %}

Extracting code into an outer layer wherever it is carries with it a cost. Rather than isolating some concerns to a particular method or class, you've pulled out and exposed it to a broader audience. Later on, you or your fellow devs will have to piecemeal together code in different files in various layers and make sense of it. Another worry might be the stretching and twisting of this pulled-out code in order to be reused. How often have you seen a boolean parameter added to a method to accomplish this, or the internals of the method doing additional work, querying additional data, as more and more possible conditions get added to the domain? Doing so can indicate that the focus of the method is not specific enough (it's doing too much). 

Code that is sufficiently scoped and located in the appropriate layer is resistant to this kind of change, and that is what we should strive for. Sometimes, that means not moving it into a layer at all.

# An Example 

