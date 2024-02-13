---
title: Introduction to Golang Pointers
excerpt: Whether you started with C or Python pointers in Golang can be tricky at the start. This guide will be a solid foundation to help you learn go.
publishDate: 'Oct 9 2023'
isFeatured: true
tags:
  - Guide
  - Golang
seo:
  image:
    src: '/golang-pointers-seo.webp'
    alt: Representation of references
---

Even if you are familiar with a language that has pointers like C pointers in go may still give you some trouble. This short guide will assume you have no previous knowledge of pointers to give you a ground up understanding of what they are and how they are used in golang.

## What is a pointer

In programming one of the most common things you do is create variables. When you do this the computer is reserving some portion of memory for the data you want to store. For example lets say I have a struct in go and create an variable of that type:

```go
type Foo struct {
  ID int Bar string
}

var MyData = Foo{ ID: 23, Bar: "Hello" }
```

Then there is a part of memory that now has that data stored in it.
![Memory Screen Shot 1](/golang-pointers-0.svg)

Now lets say I have a function that can accept a `Foo` and update its data.

```go
func FooFunction(data Foo) {
  data.Bar = "World"
}
FooFunction(MyData)
```

When we do this go passes the data to the function by making a copy of it and giving that copy to the function. So for example in this case our memory would look more like this.

![Memory Screen Shot 2](/golang-pointers-1.svg)

So when our function mutates the struct we instead get this version of the memory where the function modifies its copy instead of the original like we wanted.

![Memory Screen Shot 3](/golang-pointers-2.svg)

This is were pointers are helpful. If we change our function to instead take in a pointer to our strut.

```go
func FooFunction(data Foo) {
  data.Bar = "World"
}
FooFunction(&MyData)
```

Then when we pass our data to the function we will instead get a memory map that looks more like this.

![Memory Screen Shot 4](/golang-pointers-3.svg)

We have a pointer to the data which means when our function updates the data it will show in our original variable.

![Memory Screen Shot 5](/golang-pointers-4.svg)

That is the basics of pointers for golang and if all you needed to know was how to use them you can stop reading here. However if you want to look a little deeper or if you came from a language like C there is one more detail you may find intersting. Remember that I said anything that you pass to a function in go is a duplicate of its parameters. So the memory actually looks like this.

![Memory Screen Shot 6](/golang-pointers-5.svg)

It may seem like a small difference but it means that a go function cannot reassign pointers. Which means a function like this.

```go
func ReassignPointer(data *Foo, newData *Foo) {
  data = newData
}
ReassignPointer(&MyData, &SomeOtherData)
```

Would not work as intended because you are not reassigning the original pointer but instead the duplicate of the pointer. A small detail that may save you a few hours of debugging. I hope you enjoyed this quick walkthrough of go pointers and good luck on your go journey.
