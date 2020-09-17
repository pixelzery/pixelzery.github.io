---
layout: page
title: About
permalink: /about/
description: "Who am I?"
---

Hello, I am a {% include myage.html %} old person living in the UK who likes to experiment and create things. (Yes,  that age text was generated).

When I was a kid and first started programming, I did so solely for the fun of playing around with stuff and seeing what I can make. First it was little `BATCH` and `VBS` scripts, but then before I knew it, I had become absolutely obsessed with `C#` and remained so for quite a few years. What programming ability I now have today is a pure manifestation of making these countless random - even useful - projects and experimenting around for myself.

Nowadays I mainly do `Python` and dabble in a little bit of all sorts of things as well such as `Java`, `C++`, `JavaScript`, etc!

I started making this website from scratch on 06/08/2018 as a place for some of my projects to live ([details here](/web/this-website/)). Thanks for checking it out!

<div class="nav-bar">
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
