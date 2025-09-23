---
title: Designing a Domain - Part 1 - Beginnings
published: 2025-09-12
image: "./kitten-factory.webp"
description: Building something deep enough to write about, but simple enough to grok at a glance.
tags: [Meta]
category: Meta
draft: false
---

# "New Solution" - Double-Edged Sword
Greenfield development is chaotic, fun, thought-provoking - and when it's a personal project - _eerily_ limitless. In conjunction with this site, and as explained in [the future posts section]("/future-posts/"), I am putting together a playful domain from scratch that somewhat mimics a real-world application. 

::github{repo="Svengeance/KittenFactory"}

Enter a lovely world where you - yes _you_, dear customer - can design and order your very own kitten. At least, that's the basic premise of this domain. 

<video autoplay loop muted playsinline width="512" height="512">
  <source src="/images/posts/meta/designing-a-domain/but-why.webm" type="video/webm" />
</video>

While writing on various topics, I'll stretch and pull this domain to showcase how the subject matter could be applied, giving readers both sides of the story to enhance their perspective. Posts will contain not only code samples, but diffs and PRs to **implement** the topic. As a bonus, readers with opinions and a different understanding of the subject can engage directly with the modified code via GitHub.

# Choices
Given complete and isolated freedom to pick my tech stack, here's the general direction I'm angling for. 

- **Backend: ASP.NET Core**
  - A little obvious - C#'s the bread and butter and pays the bills around these parts. I did decide to try minimal endpoints though, more on that later.
- **Frontend: Vibing Vue**
  - Between the big 3 horsemen (Vue/Angular/React), Vue is my favorite. Since designing a UI For this API/domain is completely unnecessary, I'm going to take the opportunity to use AI to the best of my ability to build it. I'm sure my prompting could use work, and to be frank, I won't be holding this frontend to the same standards as my API.
- **Database: Postgres**
  - In terms of popularity and reliability, I consider Postgres to be sqlite's beefier older (I double-checked - it _is_ older, surprisingly?) brother. It does damn near everything, and it's a great excuse to bring in EF Core for data access.
- **Misc: Aspire**
  - I need experience with this, yesterday. I kind of doubted its usefulness in the wake of trivial compose files, but after effortlessly copying the [database migrations sample](https://github.com/dotnet/aspire-samples/tree/main/samples/DatabaseMigrations) for this project and seeing it all work? Glorious. This is the perfect tool for devs these days, great work to David Fowler and the rest of the team.

## Code Design
I've been in the software trenches long enough to have fostered some hard-won opinions on how code should be organized. Personally I'd have enjoyed using [fast-endpoints](https://fast-endpoints.com/) for this project; I find the REPR pattern to be perfect for anything but the _largest_ services, and even then, modularization would likely scale it just fine.

However, the goal of the platform is to provide an *easy-to-grok* codebase from which I can present ideas. If readers are too disoriented by a library that flips the script on their expectations, the project's already failed.

As a concession to the REPR notion, given that minimal APIs are knocking on the pattern's door, I will be using endpoint-files with minimal APIs. Each file will contain everything the endpoint needs - request model, validator, endpoint registration, service injection, and response model. This slots right in with vertical slice architecture, and should provide readers with enough familiarity, and is itself worth a post expanding on the reasons I prefer this style.

## Closing
My sincere hope is that long-term, the repo saves me time: I won't have to scrounge around my brain for examples that feel disconnected from the real-world, nro will I ever need to write my 25'th ToDo app. Instead, I'll have a broad ready-to-use domain that I own and understand fully, giving me ample confidence with which to flex it for the given post at hand. 

Feel free to peruse the repo and offer any feedback! 