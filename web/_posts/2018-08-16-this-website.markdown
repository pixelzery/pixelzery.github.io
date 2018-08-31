---
title: This Website
layout: post
image: "/passets/2/splash.png"
thumb: "/passets/2/thumb.png"
description: The story behind the hand-crafting of a website.
---

This website is hand-crafted from scratch with the help of [Jekyll](https://jekyllrb.com/) for the templating, [jQuery](https://jquery.com/) for the javascript stuff, a little bit of help from [Modernizr](https://modernizr.com/) for backwards-compatibility and is styled with [Sass](https://sass-lang.com/). There is very little external code or styling that is not written by myself and no starting theme was used - thus the lightweight-ness of this website as can be seen today. Source code is available in [this website's GitHub repo]({{site.gh}}/makurell.github.io).

In the past 10 days of work on this website since its conception, a total of 94 commits were made and a _lot_ of styling was done. Here is a visualisation of the commits pushed, showing the progression of the website during this time:

{% include youtube id='cJgHSf5PfWM' %}
(Yeah, I changed my name from Starry to Makurell - I'm kinda difficult when it comes to picking usernames)

{% include c title="How this Video was Made" nomk='1' %}
<p>Simply put, I traversed through all of the commits pushed to the repository with <a href="https://git-scm.com/">Git</a> and built then screenshotted each update with the help of <a href="https://www.seleniumhq.org/">Selenium</a> and overlayed some commit information with <a href="https://python-pillow.org/">PIL</a> with this script I made:</p>

{% include_relative includes/ghp_lapse.html %}

<p>This produces a bunch of screenshot images. I then stitched these images together as a video file with <a href="https://www.ffmpeg.org/">Ffmpeg</a>. Thing is, Ffmpeg (on Windows anyway) <a href="https://stackoverflow.com/a/31513542">doesn’t seem to like it</a> when you try to stitch images that have non-sequential names (I removed a bunch of the frames so there were gaps) so I renamed everything:</p>

{% include_relative includes/namer.html %}

<p><img src="/passets/2/namer-shell.png" alt="Renaming"></p>

<p>After renaming, I could succesfully stitch everything with this command:</p>
<div class="highlighter-rouge"><div class="highlight"><pre class="highlight"><code>ffmpeg -r 5 -i about/%03d.png -c:v libxvid -b:v 16000k -pix_fmt yuv420p about.avi</code></pre></div></div>

<p>Then I added fade and text ‘n stuff~</p>
{% include endc %}