---
title: 'How to write better code: Start Fresh'
excerpt: Starting anew with your software project can seem daunting. However, embracing this approach ensures your solutions are both robust and future-proof.
publishDate: 'Feb 14 2024'
tags:
  - Philosophy
  - Maintainability
  - Best Practices
seo:
  image:
    src: '/inheritancevscomp.svg'
    alt: 'Difference between composition and inheritance'
---

I think we've all been there at one point or another. You've been working on some code, some script, some new server that you have been tinkering with for a few days trying to get it to work just right to solve that one problem thats been bugging you. And finally you crack it you get the right result you've been waiting for! It finally works and you feel a sense of relief as you think your finally done and maybe you are. But if you intend on ever using or improving this code in the future there's something you must do.

**Start again from scratch.**

I know that might sound scary and crazy "Why would I start again what I have works?" That's true and if all you need is for it to work now and then you're gonna throw it away thats fine, but if its something you want to run for a long time, to maintain, or update in the future starting again has a couple of really good benefits.

When you are just throwing code at the wall to try and solve a problem you tend to end up with a more sparatic amount of functions, types, modules based on how you thought the problem would work out. There's nothing wrong with this per say if your goal is to solve some issue or scratch some itch once then go for it, if it works don't fix it. But if you are intersted in something that you can maintain and work on long term and share with others it can be a very good idea to rewrite it from scratch with all the knowledge of the problem you now have since you solved it once.

## The Problem with First Drafts

For example you may be writing a cli tool that pulls in data from an api and does some parsing on it. At first you throught it would be taking the data from the api and just printing some strings to the console so you had a data fetch function and a print function.

```golang
func main() {
  data, err := fetchAPIData()
  handleError(err)

  printData(data)
}

func fetchAPIData() (MyAPIData, error) {
  // Bulk API Fetch
}

func printData(data MyAPIData) {
  // Pretty print API data
}
```

But as your went you realized you needed to do some manipulation before you printed so you added some logic in your printing function to do that manipulation.

```golang
func main() {
  data, err := fetchAPIData()
  handleError(err)

  printData(data)
}

func fetchAPIData() (MyAPIData, error) {
  // Bulk API Fetch
}

func printData(data MyAPIData) {
  // Modify data first before printing

  // Pretty print API data
}
```

And then you realized you actually wanted some more information from another endpoint so you made your data fetching function do some more things really quick and shoved it all together into your print function.

```golang
func main() {
  data, extraData, err := fetchAPIData()
  handleError(err)

  printData(data, extraData)
}

func fetchAPIData() (MyAPIData, ExtraData, error) {
  // Bulk API Fetch

  // Extra data fetch
}

func printData(data MyAPIData, extraData ExtraData) {
  // Modify data first before printing

  // Pretty print API data with Extra data
}
```

## Benefits of Starting Over

This is a simple example but I'm sure you can see the direction this is going as my assumptions change while I'm figuring out the problem I try to squeeze it in wherever I can because I'm more focused on solving the problem then making a good "production ready" tool. But if I throw it out and start again knowing I need the extra data and knowing theres some data manipulation I can make some smarter descisions about how my code is broken up.

```golang
func main() {
  data, err := fetchAPIData()
  handleError(err)

  extra, err := fetchDependentAPIData(data)
  handleError(err)

  results, err := transformData(data, extra)
  handleError(err)

  printResults(results)
}

func fetchAPIData() (MyAPIData, error) {
  // Fetch initial data
}

func fetchDependentAPIData(data MyAPIData) (ExtraData, error) {
  // Use depedent data to fetch more data
}

func transformData(data MyAPIData, extra ExtraData) (TransformedData, error) {
  // Take raw input data and transform it into my output ready format raise any data errors
}

func printResults(data TransformedData) {
  // Pretty print transformed data
}
```

In this new refactored form there are a couple of key differences. Each function has one clear output and simple inputs. This means its much easier to test each component since the surface area is smaller and makes it easier to identify where a problem might be. Let's say down the line I wanted to have options for how the data is transformed into the transformed data. With this new structure its very easy to refactor the main function to have a selection of transform functions instead of nesting it into the print function.

```golang
func main() {
  //...

  var results TransformedData
  switch (choice) {
    case "transform1":
      results, err = transformData1(data, extra)
    case "transform2":
      results, err = transformData2(data, extra)
  }

  //...
}
```

While this is a pretty simple example I hope its shown the principle well. When you have some code, tool, application that you want to be able to maintain long term once you have your MVP scrap it and write it again with the new knowledge of the problem you have now I promise you'll build something much more maintainable and you'll save yourself a big headache down the line. I'd even say if you want to write amazing code with all the production bells and whistles like good logging, good metrics gathering, easy configurations I would throw it out twice and write the third version with these things in mind now that you really understand how to structure the solution.
