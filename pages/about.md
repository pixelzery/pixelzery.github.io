---
layout: page
title: About
permalink: /about/
---

Thank you for visiting my website! (◍•ᴗ•◍)

I am a {% include myage.html %} old person living in the UK who likes to experiment, to create things and occasionally to look out at the dark sky on long nights.

When I was a kid and first started programming, I did so solely for the fun of playing around with stuff and seeing what I can make. First it was funny little `BATCH` and `VBS` scripts, but then before I knew it, I had become addicted to `C#` and remained so for many years. Making countless random - even useful - projects and experimenting around has manifested in what programming ability I have today. I have a similar attitude to things like language and art too&#126;!

Nowadays I also do python and all sorts :)

I started this website on 06/08/2018 as a place for some of my projects to live. [The website itself is also one of them]({{ site.gh }}/starryyy.github.io)! Thanks for checking them out!

<div class="nav">
	{% for opt in site.author %}
	{% case opt[0] %}
		{% when 'twitter' %}
		<a class="opt" href="https://twitter.com/{{ opt[1] }}">{{ opt[0] }}</a>
		{% when 'github' %}
		<a class="opt" href="https://github.com/{{ opt[1] }}">{{ opt[0] }}</a>
		{% when 'instagram' %}
		<a class="opt" href="https://instagram.com/{{ opt[1] }}">{{ opt[0] }}</a>
		{% when 'email' %}
		<a class="opt" href="mailto:{{ opt[1] }}">{{ opt[0] }}</a>
	{% endcase %}
	{% endfor %}
</div>
