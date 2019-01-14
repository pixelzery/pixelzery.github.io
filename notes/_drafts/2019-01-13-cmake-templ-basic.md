---
title: Basic CMake Template
layout: post
description: Basic CMake template (`CMakeLists.txt`)
date: 2019-01-13 13:03:00
---

```cmake
cmake_minimum_required(VERSION 3.5)
project(BoolSimplifier)

SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wall -g -std=c++11")

set(SOURCE_FILES
        main.cpp
        model/Symbol.cpp
        model/Symbol.h
        ...)
add_executable(BoolSimplifier ${SOURCE_FILES})
```