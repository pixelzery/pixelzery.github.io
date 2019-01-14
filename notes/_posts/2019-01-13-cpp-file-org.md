---
title: C++ File Organisation
layout: post
description: My C++ files organisation practice.
date: 2019-01-13 13:00:00
---

Each class has their own `ClassName.cpp` and `ClassName.h` files. The `.h` files will hold all usages (`#include` statements) and _declarations_. The `.cpp` files will hold respective _definitions_.

`.h` style:

```cpp
#ifndef PROJECTNAME_CLASSNAME_H
#define PROJECTNAME_CLASSNAME_H
#include <include>

class ClassName{
};

#endif // PROJECTNAME_CLASSNAME_H
```
