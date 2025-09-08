---
title: Aspiring to be Great - Expectations, Hopes, and Dreams
published: 2025-09-07
tags: [Aspire, DevX, Tools]
category: Devlog
draft: false
---

# Expire the Old, Inspire to Aspire
The creation of this blog gave me an excuse to click every developer's favorite button: `New Solution`. A personal project with no restrictions on tech stack, patterns, and a foggy future can be as paralyzing as it is freeing. 

Given the professional career at this time is not in shape to bring in [Aspire](https://learn.microsoft.com/en-us/dotnet/aspire/get-started/aspire-overview), it seemed a perfect opportunity for a little experimentation. As a part of the [largest C# Discord server](https://discord.gg/csharp), it's become a meme to see [David Fowler](https://github.com/davidfowl) respond rather quickly to any mention of Aspire, and the conversation _has_ been picking up steam. I've asked my fair share of questions on the subject as well, and am itching to try it based on what I've heard.

For those without context - Aspire is Microsoft's latest developer-focused invention that aims to modernize the local development experience of the distributed stacks that have become so commonplace. It promises to trivialize the setup and interoperability of each service, while providing visibility via OpenTelemetry (logs, traces, and metrics). If you find yourself hopping from project to project to run them in sequence, spinning up multiple dependencies like caches and databases, or you've written yourself a fancy compose or bash script to do the same, Aspire is here to orchestrate the pain away. Read [the official Microsoft documentation](https://learn.microsoft.com/en-us/dotnet/aspire/get-started/aspire-overview) for more info and give'r a shot.

## Professional Suffering
Here are some of my pain points as a professional dev that I've been told Aspire can help with:

- Docker and containers are, compared to native debugging, less friendly and more resource intensive, and [can sometimes break dev tools](https://youtrack.jetbrains.com/projects/RIDER/issues/RIDER-94485/Add-support-for-DefaultAzureCredential-when-running-inside-docker)
- The system that drives my application may require X# services to run, but the part that I'm working on only needs a quarter of the system
- I need to be able to modify a service in the system and quickly see the results; I should not have to reload the entire system, resetting the state of all other services in the process (fast feedback loops)
- End to end testing of a distributed system is usually only done in deployed environments, but it should be possible to containerize your system and test that just the same
- Our developer setup involves scripts to furnish Azure resources, create local env vars, add permissions to key vaults, and we alternate between developer-specific resources and shared resources; can Aspire inject some sanity?
- Each project may also have its own setup (install/trust these certs, use this AZURE_CLIENT_ID/AZURE_CLIENT_SECRET combo) that are easily missed or create weird/confusing errors when they aren't done 100% correctly

## Personal Goals
Given I'll be using Aspire personally for [KittenFactory](/future-posts/#establish-a-domain), here are some expectations I have:

- With the most basic resources (redis, postgres, MAYBE a service bus?), all integrations should work, and I can emulate a distributed system locally
- Full visibility with OpenTelemetry for all of these services
- Relatively low-friction feedback loops, where I can edit the API and services, hot-reload where possible, or otherwise quickly restart
- Sensible configuration defaults - the dependencies I have "just work" out of the box, are easy to configure where needed, and the bindings between my C# services and these dependencies are intuitive to understand

## Already Promising!
At the time of writing I've got my database and migrations up and running in Aspire - altogether, I'm _very_ pleased with the system so far. The next post will talk about the process of getting it setup, documentation I followed, any gotchas I experienced, and code samples of the setup thus far.
