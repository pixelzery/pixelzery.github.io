---
title: C++ String Overriding
layout: post
description: Equivalent of overriding `.toString()` (Java/C#/etc) in C++
date: 2019-01-13 13:15:00
---

```cpp
// Symbol.h extract
class Symbol {
public:
    virtual std::string render();
    friend std::ostream & operator<<(std::ostream &stream, Symbol &v);
};
```

```cpp
// Symbol.cpp extract
#include "Symbol.h"

std::ostream &operator<<(std::ostream &stream, Symbol &v) {
    return stream << v.render();
}
```

Then:

```cpp
// Variable.h extract
class Variable: public Symbol {
public:
    std::string name;

    explicit Variable(const char* name);
    std::string render() override;
};
```

```cpp
// Variable.cpp
#include "Variable.h"

Variable::Variable(const char* name) {
    this->name = name;
}

std::string Variable::render() {
    return this->name;
}
```