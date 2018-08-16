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

Simply put, I traversed through all of the commits pushed to the repository with [Git](https://git-scm.com/) and built then screenshotted each update with the help of [Selenium](https://www.seleniumhq.org/) in this script I made:

```python
import os
from time import sleep
from PIL import ImageFont, Image, ImageDraw
from selenium import webdriver
from subprocess import run, Popen, PIPE
from datetime import datetime
from selenium.webdriver.chrome.options import Options

cwd=None

def get_name(url):
    s = url[url.rfind('/') + 1:]
    return s[:s.rfind('.')]

def get_msg():
    return read(git('log','-1','--pretty=%B'))[0]

def get_date():
    return datetime.utcfromtimestamp(int(read(git('log','-1','--format=%ct'))[0]))

def git(*params):
    ps=['git','--no-pager']
    ps.extend(params)
    if cwd is not None:
        result=run(ps,stdout=PIPE,cwd=cwd)
    else:
        result=run(ps,stdout=PIPE)
    return result

def read(result):
    ret = []
    for line in result.stdout.decode('utf-8').split('\n'):
        if line.strip() != '':
            ret.append(line)
    return ret

def get_config():
    if cwd is not None:
        with open(os.path.join(cwd,'_config.yml'), 'r') as f:
            return f.read()
    else:
        return None

def cdir(path):
    if not os.path.exists(path):
        os.makedirs(path)


def overlay_img(text, path, fontpath="lato.ttf", size=16, fore=(255, 255, 255), back=(34, 34, 34), pad=10):
    font = ImageFont.truetype(fontpath, size)

    with Image.open(path) as img:
        w, h = img.size
        tw, th = font.getsize(text)

        draw = ImageDraw.Draw(img)
        draw.rectangle((0, h - th - pad * 2, tw + pad * 2, h), fill=back)
        draw.text((pad, h - th - pad), text, fore, font=font)
        img.save(path)

def save(driver,overlay,i,path,*locs):
    if locs is not None:
    	cdir(os.path.join(path,*locs))
    	path = os.path.join(path,*locs, str(i) + '.png')
    else:
    	path = os.path.join(path, str(i) + '.png')
    	cdir(path)
    driver.get("http://localhost:4000/"+('/'.join(locs)))
    sleep(1)
    driver.save_screenshot(path)
    overlay_img(overlay,path)

remote_url=input("Repo URL: ").strip()
git('clone',remote_url)

cwd=get_name(remote_url)
git('checkout','-f','master')
hashes=read(git('log','--pretty=%H'))

print("found "+str(len(hashes))+" commits")

chrome_options = Options()
chrome_options.add_argument("--start-maximized")
driver=webdriver.Chrome('chromedriver.exe',chrome_options=chrome_options)
i=0
for commit in reversed(hashes):
    web_dir=os.path.join(cwd,'_site')

    git('checkout','-f',commit)
    print("@:"+get_msg())
    run(['C:\\Ruby24-x64\\bin\\bundle.bat', 'exec', 'jekyll', 'build'],cwd=cwd)
    print("jekyll built")

    #start server
    if os.path.exists(web_dir):
        print("serving...")
        jproc=Popen(['C:\\Ruby24-x64\\bin\\bundle.bat', 'exec', 'jekyll', 'serve','--skip-initial-build','--no-watch'],cwd=cwd)
        sleep(2)

        overlay=get_date().strftime('%d/%m/%y %H:%M')+' - '+get_msg()
        print(overlay)
        save(driver,overlay,i,os.path.join('out','home'))
        save(driver,overlay,i,'out','about')
        save(driver,overlay,i,'out','h')
        save(driver,overlay,i,'out','e')
        save(driver,overlay,i,'out','m')
        print("screenshotted")

        jproc.kill()
        print("served")

    i+=1
driver.quit()
git('checkout','-f','master')
print("done")

```
