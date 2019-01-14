---
title: Freeing a List of Pointers
layout: post
description: 'Freeing a list of pointers in C++'
date: 2019-01-13 13:08:00
---

How to free a list of pointers properly:

```cpp
list<Entity*> l = ...;
while(!l.empty()){
    delete l.front();
    l.pop_front();
}
```

Just calling `l.clear()` is insufficient and will result in memory leaks.
