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

{% include c title="How this Video was Made" nomk="true" %}
<p>Simply put, I traversed through all of the commits pushed to the repository with <a href="https://git-scm.com/">Git</a> and built then screenshotted each update with the help of <a href="https://www.seleniumhq.org/">Selenium</a> and overlayed some commit information with <a href="https://python-pillow.org/">PIL</a> in this script I made:</p>

<div class="language-python highlighter-rouge"><div class="highlight"><pre class="highlight"><code><span class="kn">import</span> <span class="nn">os</span>
<span class="kn">from</span> <span class="nn">time</span> <span class="kn">import</span> <span class="n">sleep</span>
<span class="kn">from</span> <span class="nn">PIL</span> <span class="kn">import</span> <span class="n">ImageFont</span><span class="p">,</span> <span class="n">Image</span><span class="p">,</span> <span class="n">ImageDraw</span>
<span class="kn">from</span> <span class="nn">selenium</span> <span class="kn">import</span> <span class="n">webdriver</span>
<span class="kn">from</span> <span class="nn">subprocess</span> <span class="kn">import</span> <span class="n">run</span><span class="p">,</span> <span class="n">Popen</span><span class="p">,</span> <span class="n">PIPE</span>
<span class="kn">from</span> <span class="nn">datetime</span> <span class="kn">import</span> <span class="n">datetime</span>
<span class="kn">from</span> <span class="nn">selenium.webdriver.chrome.options</span> <span class="kn">import</span> <span class="n">Options</span>

<span class="n">cwd</span><span class="o">=</span><span class="bp">None</span>

<span class="k">def</span> <span class="nf">get_name</span><span class="p">(</span><span class="n">url</span><span class="p">):</span>
<span class="n">s</span> <span class="o">=</span> <span class="n">url</span><span class="p">[</span><span class="n">url</span><span class="o">.</span><span class="n">rfind</span><span class="p">(</span><span class="s">'/'</span><span class="p">)</span> <span class="o">+</span> <span class="mi">1</span><span class="p">:]</span>
<span class="k">return</span> <span class="n">s</span><span class="p">[:</span><span class="n">s</span><span class="o">.</span><span class="n">rfind</span><span class="p">(</span><span class="s">'.'</span><span class="p">)]</span>

<span class="k">def</span> <span class="nf">get_msg</span><span class="p">():</span>
<span class="k">return</span> <span class="n">read</span><span class="p">(</span><span class="n">git</span><span class="p">(</span><span class="s">'log'</span><span class="p">,</span><span class="s">'-1'</span><span class="p">,</span><span class="s">'--pretty=</span><span class="si">%</span><span class="s">B'</span><span class="p">))[</span><span class="mi">0</span><span class="p">]</span>

<span class="k">def</span> <span class="nf">get_date</span><span class="p">():</span>
<span class="k">return</span> <span class="n">datetime</span><span class="o">.</span><span class="n">utcfromtimestamp</span><span class="p">(</span><span class="nb">int</span><span class="p">(</span><span class="n">read</span><span class="p">(</span><span class="n">git</span><span class="p">(</span><span class="s">'log'</span><span class="p">,</span><span class="s">'-1'</span><span class="p">,</span><span class="s">'--format=</span><span class="si">%</span><span class="s">ct'</span><span class="p">))[</span><span class="mi">0</span><span class="p">]))</span>

<span class="k">def</span> <span class="nf">git</span><span class="p">(</span><span class="o">*</span><span class="n">params</span><span class="p">):</span>
<span class="n">ps</span><span class="o">=</span><span class="p">[</span><span class="s">'git'</span><span class="p">,</span><span class="s">'--no-pager'</span><span class="p">]</span>
<span class="n">ps</span><span class="o">.</span><span class="n">extend</span><span class="p">(</span><span class="n">params</span><span class="p">)</span>
<span class="k">if</span> <span class="n">cwd</span> <span class="ow">is</span> <span class="ow">not</span> <span class="bp">None</span><span class="p">:</span>
<span class="n">result</span><span class="o">=</span><span class="n">run</span><span class="p">(</span><span class="n">ps</span><span class="p">,</span><span class="n">stdout</span><span class="o">=</span><span class="n">PIPE</span><span class="p">,</span><span class="n">cwd</span><span class="o">=</span><span class="n">cwd</span><span class="p">)</span>
<span class="k">else</span><span class="p">:</span>
<span class="n">result</span><span class="o">=</span><span class="n">run</span><span class="p">(</span><span class="n">ps</span><span class="p">,</span><span class="n">stdout</span><span class="o">=</span><span class="n">PIPE</span><span class="p">)</span>
<span class="k">return</span> <span class="n">result</span>

<span class="k">def</span> <span class="nf">read</span><span class="p">(</span><span class="n">result</span><span class="p">):</span>
<span class="n">ret</span> <span class="o">=</span> <span class="p">[]</span>
<span class="k">for</span> <span class="n">line</span> <span class="ow">in</span> <span class="n">result</span><span class="o">.</span><span class="n">stdout</span><span class="o">.</span><span class="n">decode</span><span class="p">(</span><span class="s">'utf-8'</span><span class="p">)</span><span class="o">.</span><span class="n">split</span><span class="p">(</span><span class="s">'</span><span class="se">\n</span><span class="s">'</span><span class="p">):</span>
<span class="k">if</span> <span class="n">line</span><span class="o">.</span><span class="n">strip</span><span class="p">()</span> <span class="o">!=</span> <span class="s">''</span><span class="p">:</span>
<span class="n">ret</span><span class="o">.</span><span class="n">append</span><span class="p">(</span><span class="n">line</span><span class="p">)</span>
<span class="k">return</span> <span class="n">ret</span>

<span class="k">def</span> <span class="nf">get_config</span><span class="p">():</span>
<span class="k">if</span> <span class="n">cwd</span> <span class="ow">is</span> <span class="ow">not</span> <span class="bp">None</span><span class="p">:</span>
<span class="k">with</span> <span class="nb">open</span><span class="p">(</span><span class="n">os</span><span class="o">.</span><span class="n">path</span><span class="o">.</span><span class="n">join</span><span class="p">(</span><span class="n">cwd</span><span class="p">,</span><span class="s">'_config.yml'</span><span class="p">),</span> <span class="s">'r'</span><span class="p">)</span> <span class="k">as</span> <span class="n">f</span><span class="p">:</span>
<span class="k">return</span> <span class="n">f</span><span class="o">.</span><span class="n">read</span><span class="p">()</span>
<span class="k">else</span><span class="p">:</span>
<span class="k">return</span> <span class="bp">None</span>

<span class="k">def</span> <span class="nf">cdir</span><span class="p">(</span><span class="n">path</span><span class="p">):</span>
<span class="k">if</span> <span class="ow">not</span> <span class="n">os</span><span class="o">.</span><span class="n">path</span><span class="o">.</span><span class="n">exists</span><span class="p">(</span><span class="n">path</span><span class="p">):</span>
<span class="n">os</span><span class="o">.</span><span class="n">makedirs</span><span class="p">(</span><span class="n">path</span><span class="p">)</span>


<span class="k">def</span> <span class="nf">overlay_img</span><span class="p">(</span><span class="n">text</span><span class="p">,</span> <span class="n">path</span><span class="p">,</span> <span class="n">fontpath</span><span class="o">=</span><span class="s">"lato.ttf"</span><span class="p">,</span> <span class="n">size</span><span class="o">=</span><span class="mi">16</span><span class="p">,</span> <span class="n">fore</span><span class="o">=</span><span class="p">(</span><span class="mi">255</span><span class="p">,</span> <span class="mi">255</span><span class="p">,</span> <span class="mi">255</span><span class="p">),</span> <span class="n">back</span><span class="o">=</span><span class="p">(</span><span class="mi">34</span><span class="p">,</span> <span class="mi">34</span><span class="p">,</span> <span class="mi">34</span><span class="p">),</span> <span class="n">pad</span><span class="o">=</span><span class="mi">10</span><span class="p">):</span>
<span class="n">font</span> <span class="o">=</span> <span class="n">ImageFont</span><span class="o">.</span><span class="n">truetype</span><span class="p">(</span><span class="n">fontpath</span><span class="p">,</span> <span class="n">size</span><span class="p">)</span>

<span class="k">with</span> <span class="n">Image</span><span class="o">.</span><span class="nb">open</span><span class="p">(</span><span class="n">path</span><span class="p">)</span> <span class="k">as</span> <span class="n">img</span><span class="p">:</span>
<span class="n">w</span><span class="p">,</span> <span class="n">h</span> <span class="o">=</span> <span class="n">img</span><span class="o">.</span><span class="n">size</span>
<span class="n">tw</span><span class="p">,</span> <span class="n">th</span> <span class="o">=</span> <span class="n">font</span><span class="o">.</span><span class="n">getsize</span><span class="p">(</span><span class="n">text</span><span class="p">)</span>

<span class="n">draw</span> <span class="o">=</span> <span class="n">ImageDraw</span><span class="o">.</span><span class="n">Draw</span><span class="p">(</span><span class="n">img</span><span class="p">)</span>
<span class="n">draw</span><span class="o">.</span><span class="n">rectangle</span><span class="p">((</span><span class="mi">0</span><span class="p">,</span> <span class="n">h</span> <span class="o">-</span> <span class="n">th</span> <span class="o">-</span> <span class="n">pad</span> <span class="o">*</span> <span class="mi">2</span><span class="p">,</span> <span class="n">tw</span> <span class="o">+</span> <span class="n">pad</span> <span class="o">*</span> <span class="mi">2</span><span class="p">,</span> <span class="n">h</span><span class="p">),</span> <span class="n">fill</span><span class="o">=</span><span class="n">back</span><span class="p">)</span>
<span class="n">draw</span><span class="o">.</span><span class="n">text</span><span class="p">((</span><span class="n">pad</span><span class="p">,</span> <span class="n">h</span> <span class="o">-</span> <span class="n">th</span> <span class="o">-</span> <span class="n">pad</span><span class="p">),</span> <span class="n">text</span><span class="p">,</span> <span class="n">fore</span><span class="p">,</span> <span class="n">font</span><span class="o">=</span><span class="n">font</span><span class="p">)</span>
<span class="n">img</span><span class="o">.</span><span class="n">save</span><span class="p">(</span><span class="n">path</span><span class="p">)</span>

<span class="k">def</span> <span class="nf">save</span><span class="p">(</span><span class="n">driver</span><span class="p">,</span><span class="n">overlay</span><span class="p">,</span><span class="n">i</span><span class="p">,</span><span class="n">path</span><span class="p">,</span><span class="o">*</span><span class="n">locs</span><span class="p">):</span>
<span class="k">if</span> <span class="n">locs</span> <span class="ow">is</span> <span class="ow">not</span> <span class="bp">None</span><span class="p">:</span>
<span class="n">cdir</span><span class="p">(</span><span class="n">os</span><span class="o">.</span><span class="n">path</span><span class="o">.</span><span class="n">join</span><span class="p">(</span><span class="n">path</span><span class="p">,</span><span class="o">*</span><span class="n">locs</span><span class="p">))</span>
<span class="n">path</span> <span class="o">=</span> <span class="n">os</span><span class="o">.</span><span class="n">path</span><span class="o">.</span><span class="n">join</span><span class="p">(</span><span class="n">path</span><span class="p">,</span><span class="o">*</span><span class="n">locs</span><span class="p">,</span> <span class="nb">str</span><span class="p">(</span><span class="n">i</span><span class="p">)</span> <span class="o">+</span> <span class="s">'.png'</span><span class="p">)</span>
<span class="k">else</span><span class="p">:</span>
<span class="n">path</span> <span class="o">=</span> <span class="n">os</span><span class="o">.</span><span class="n">path</span><span class="o">.</span><span class="n">join</span><span class="p">(</span><span class="n">path</span><span class="p">,</span> <span class="nb">str</span><span class="p">(</span><span class="n">i</span><span class="p">)</span> <span class="o">+</span> <span class="s">'.png'</span><span class="p">)</span>
<span class="n">cdir</span><span class="p">(</span><span class="n">path</span><span class="p">)</span>
<span class="n">driver</span><span class="o">.</span><span class="n">get</span><span class="p">(</span><span class="s">"http://localhost:4000/"</span><span class="o">+</span><span class="p">(</span><span class="s">'/'</span><span class="o">.</span><span class="n">join</span><span class="p">(</span><span class="n">locs</span><span class="p">)))</span>
<span class="n">sleep</span><span class="p">(</span><span class="mi">1</span><span class="p">)</span>
<span class="n">driver</span><span class="o">.</span><span class="n">save_screenshot</span><span class="p">(</span><span class="n">path</span><span class="p">)</span>
<span class="n">overlay_img</span><span class="p">(</span><span class="n">overlay</span><span class="p">,</span><span class="n">path</span><span class="p">)</span>

<span class="n">remote_url</span><span class="o">=</span><span class="nb">input</span><span class="p">(</span><span class="s">"Repo URL: "</span><span class="p">)</span><span class="o">.</span><span class="n">strip</span><span class="p">()</span>
<span class="n">git</span><span class="p">(</span><span class="s">'clone'</span><span class="p">,</span><span class="n">remote_url</span><span class="p">)</span>

<span class="n">cwd</span><span class="o">=</span><span class="n">get_name</span><span class="p">(</span><span class="n">remote_url</span><span class="p">)</span>
<span class="n">git</span><span class="p">(</span><span class="s">'checkout'</span><span class="p">,</span><span class="s">'-f'</span><span class="p">,</span><span class="s">'master'</span><span class="p">)</span>
<span class="n">hashes</span><span class="o">=</span><span class="n">read</span><span class="p">(</span><span class="n">git</span><span class="p">(</span><span class="s">'log'</span><span class="p">,</span><span class="s">'--pretty=</span><span class="si">%</span><span class="s">H'</span><span class="p">))</span>

<span class="k">print</span><span class="p">(</span><span class="s">"found "</span><span class="o">+</span><span class="nb">str</span><span class="p">(</span><span class="nb">len</span><span class="p">(</span><span class="n">hashes</span><span class="p">))</span><span class="o">+</span><span class="s">" commits"</span><span class="p">)</span>

<span class="n">chrome_options</span> <span class="o">=</span> <span class="n">Options</span><span class="p">()</span>
<span class="n">chrome_options</span><span class="o">.</span><span class="n">add_argument</span><span class="p">(</span><span class="s">"--start-maximized"</span><span class="p">)</span>
<span class="n">driver</span><span class="o">=</span><span class="n">webdriver</span><span class="o">.</span><span class="n">Chrome</span><span class="p">(</span><span class="s">'chromedriver.exe'</span><span class="p">,</span><span class="n">chrome_options</span><span class="o">=</span><span class="n">chrome_options</span><span class="p">)</span>
<span class="n">i</span><span class="o">=</span><span class="mi">0</span>
<span class="k">for</span> <span class="n">commit</span> <span class="ow">in</span> <span class="nb">reversed</span><span class="p">(</span><span class="n">hashes</span><span class="p">):</span>
<span class="n">web_dir</span><span class="o">=</span><span class="n">os</span><span class="o">.</span><span class="n">path</span><span class="o">.</span><span class="n">join</span><span class="p">(</span><span class="n">cwd</span><span class="p">,</span><span class="s">'_site'</span><span class="p">)</span>

<span class="n">git</span><span class="p">(</span><span class="s">'checkout'</span><span class="p">,</span><span class="s">'-f'</span><span class="p">,</span><span class="n">commit</span><span class="p">)</span>
<span class="k">print</span><span class="p">(</span><span class="s">"@:"</span><span class="o">+</span><span class="n">get_msg</span><span class="p">())</span>
<span class="n">run</span><span class="p">([</span><span class="s">'C:</span><span class="se">\\</span><span class="s">Ruby24-x64</span><span class="se">\\</span><span class="s">bin</span><span class="se">\\</span><span class="s">bundle.bat'</span><span class="p">,</span> <span class="s">'exec'</span><span class="p">,</span> <span class="s">'jekyll'</span><span class="p">,</span> <span class="s">'build'</span><span class="p">],</span><span class="n">cwd</span><span class="o">=</span><span class="n">cwd</span><span class="p">)</span>
<span class="k">print</span><span class="p">(</span><span class="s">"jekyll built"</span><span class="p">)</span>

<span class="c">#start server</span>
<span class="k">if</span> <span class="n">os</span><span class="o">.</span><span class="n">path</span><span class="o">.</span><span class="n">exists</span><span class="p">(</span><span class="n">web_dir</span><span class="p">):</span>
<span class="k">print</span><span class="p">(</span><span class="s">"serving..."</span><span class="p">)</span>
<span class="n">jproc</span><span class="o">=</span><span class="n">Popen</span><span class="p">([</span><span class="s">'C:</span><span class="se">\\</span><span class="s">Ruby24-x64</span><span class="se">\\</span><span class="s">bin</span><span class="se">\\</span><span class="s">bundle.bat'</span><span class="p">,</span> <span class="s">'exec'</span><span class="p">,</span> <span class="s">'jekyll'</span><span class="p">,</span> <span class="s">'serve'</span><span class="p">,</span><span class="s">'--skip-initial-build'</span><span class="p">,</span><span class="s">'--no-watch'</span><span class="p">],</span><span class="n">cwd</span><span class="o">=</span><span class="n">cwd</span><span class="p">)</span>
<span class="n">sleep</span><span class="p">(</span><span class="mi">2</span><span class="p">)</span>

<span class="n">overlay</span><span class="o">=</span><span class="n">get_date</span><span class="p">()</span><span class="o">.</span><span class="n">strftime</span><span class="p">(</span><span class="s">'</span><span class="si">%</span><span class="s">d/</span><span class="si">%</span><span class="s">m/</span><span class="si">%</span><span class="s">y </span><span class="si">%</span><span class="s">H:</span><span class="si">%</span><span class="s">M'</span><span class="p">)</span><span class="o">+</span><span class="s">' - '</span><span class="o">+</span><span class="n">get_msg</span><span class="p">()</span>
<span class="k">print</span><span class="p">(</span><span class="n">overlay</span><span class="p">)</span>
<span class="n">save</span><span class="p">(</span><span class="n">driver</span><span class="p">,</span><span class="n">overlay</span><span class="p">,</span><span class="n">i</span><span class="p">,</span><span class="n">os</span><span class="o">.</span><span class="n">path</span><span class="o">.</span><span class="n">join</span><span class="p">(</span><span class="s">'out'</span><span class="p">,</span><span class="s">'home'</span><span class="p">))</span>
<span class="n">save</span><span class="p">(</span><span class="n">driver</span><span class="p">,</span><span class="n">overlay</span><span class="p">,</span><span class="n">i</span><span class="p">,</span><span class="s">'out'</span><span class="p">,</span><span class="s">'about'</span><span class="p">)</span>
<span class="n">save</span><span class="p">(</span><span class="n">driver</span><span class="p">,</span><span class="n">overlay</span><span class="p">,</span><span class="n">i</span><span class="p">,</span><span class="s">'out'</span><span class="p">,</span><span class="s">'h'</span><span class="p">)</span>
<span class="n">save</span><span class="p">(</span><span class="n">driver</span><span class="p">,</span><span class="n">overlay</span><span class="p">,</span><span class="n">i</span><span class="p">,</span><span class="s">'out'</span><span class="p">,</span><span class="s">'e'</span><span class="p">)</span>
<span class="n">save</span><span class="p">(</span><span class="n">driver</span><span class="p">,</span><span class="n">overlay</span><span class="p">,</span><span class="n">i</span><span class="p">,</span><span class="s">'out'</span><span class="p">,</span><span class="s">'m'</span><span class="p">)</span>
<span class="k">print</span><span class="p">(</span><span class="s">"screenshotted"</span><span class="p">)</span>

<span class="n">jproc</span><span class="o">.</span><span class="n">kill</span><span class="p">()</span>
<span class="k">print</span><span class="p">(</span><span class="s">"served"</span><span class="p">)</span>

<span class="n">i</span><span class="o">+=</span><span class="mi">1</span>
<span class="n">driver</span><span class="o">.</span><span class="n">quit</span><span class="p">()</span>
<span class="n">git</span><span class="p">(</span><span class="s">'checkout'</span><span class="p">,</span><span class="s">'-f'</span><span class="p">,</span><span class="s">'master'</span><span class="p">)</span>
<span class="k">print</span><span class="p">(</span><span class="s">"done"</span><span class="p">)</span>

</code></pre></div></div>
<p>This produces a bunch of screenshot images. I then stitched these images together as a video file with <a href="https://www.ffmpeg.org/">Ffmpeg</a>. Thing is, Ffmpeg (on Windows anyway) <a href="https://stackoverflow.com/a/31513542">doesn’t seem to like it</a> when you try to stitch images that have non-sequential names (I removed a bunch of the frames so there were gaps) so I renamed everything:</p>

<div class="language-python highlighter-rouge"><div class="highlight"><pre class="highlight"><code><span class="kn">import</span> <span class="nn">os</span>
<span class="kn">import</span> <span class="nn">re</span>
<span class="k">def</span> <span class="nf">naturalSort</span><span class="p">(</span><span class="n">l</span><span class="p">):</span>
<span class="n">l</span><span class="o">.</span><span class="n">sort</span><span class="p">(</span><span class="n">key</span><span class="o">=</span><span class="k">lambda</span> <span class="n">x</span><span class="p">:[(</span><span class="nb">int</span><span class="p">(</span><span class="n">c</span><span class="p">)</span> <span class="k">if</span> <span class="n">c</span><span class="o">.</span><span class="n">isdigit</span><span class="p">()</span> <span class="k">else</span> <span class="n">c</span><span class="p">)</span> <span class="k">for</span> <span class="n">c</span> <span class="ow">in</span> <span class="n">re</span><span class="o">.</span><span class="n">split</span><span class="p">(</span><span class="s">'([0-9]+)'</span><span class="p">,</span> <span class="n">x</span><span class="p">)])</span>
<span class="k">return</span> <span class="n">l</span>
<span class="n">i</span><span class="o">=</span><span class="mi">1</span>
<span class="n">dirname</span><span class="o">=</span><span class="s">'home'</span>
<span class="k">for</span> <span class="n">img</span> <span class="ow">in</span> <span class="n">naturalSort</span><span class="p">([</span> <span class="n">x</span> <span class="k">for</span> <span class="n">x</span> <span class="ow">in</span> <span class="n">os</span><span class="o">.</span><span class="n">listdir</span><span class="p">(</span><span class="n">dirname</span><span class="p">)</span> <span class="k">if</span> <span class="n">x</span><span class="o">.</span><span class="n">endswith</span><span class="p">(</span><span class="s">'.png'</span><span class="p">)]):</span>
<span class="n">name</span><span class="o">=</span><span class="n">f</span><span class="s">'{i:03}.png'</span>
<span class="k">print</span><span class="p">(</span><span class="n">f</span><span class="s">'{img}-&gt;{name}'</span><span class="p">)</span>
<span class="n">os</span><span class="o">.</span><span class="n">rename</span><span class="p">(</span><span class="n">os</span><span class="o">.</span><span class="n">path</span><span class="o">.</span><span class="n">join</span><span class="p">(</span><span class="n">dirname</span><span class="p">,</span><span class="n">img</span><span class="p">),</span><span class="n">os</span><span class="o">.</span><span class="n">path</span><span class="o">.</span><span class="n">join</span><span class="p">(</span><span class="n">dirname</span><span class="p">,</span><span class="n">name</span><span class="p">))</span>
<span class="n">i</span><span class="o">+=</span><span class="mi">1</span>

</code></pre></div></div>
<p><img src="/passets/2/1.png" alt="Renaming"></p>

<p>and then I could stitch together the images like so:</p>
<div class="highlighter-rouge"><div class="highlight"><pre class="highlight"><code>ffmpeg -r 5 -i about/%03d.png -c:v libxvid -b:v 16000k -pix_fmt yuv420p about.avi
</code></pre></div></div>

<p>Then I added fade and text ‘n stuff~</p>
{% include endc %}