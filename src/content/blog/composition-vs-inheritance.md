---
title: Composition vs Inheritance
excerpt: The topic of how to structure reusuable code chuncks often comes down to a debate of composition vs inheriance. I will answer the questions of what do these terms mean and how can I apply them in my own code?
publishDate: 'Feb 14 2024'
tags:
  - Architecture
  - Maintainability
seo:
  image:
    src: '/inheritancevscomp.svg'
    alt: 'Difference between composition and inheritance'
---

Before we can compare inheritance and composition we need to have a good definition for each and what they try to do. Both inheritance and composition attempt to accomplish the same goal, having some chunk of code that you want to reuse in multiple places.

For this article I'll use an example from a [very good video](https://www.youtube.com/watch?v=hxGOiiR9ZKg) that also explains this topic as a start and then bring in a more complex example to show just how powerful composition can be. The example we have is some code that stores an RGB image in memory and provides some simple functions for looking up pixel values and for flipping or resizing the image.

```python
class Image:
  def __init__(self, width: int = 0, height: int = 0):
    self.setSize(width, height)

  def setSize(self, width: int, height: int):
    self.pixels = [[(0, 0, 0) for x in range(w)] for y in range(h)]

  def getPixel(self, x: int, y: int) -> Tuple(int, int, int):
    return self.pixels[x][y]

  def setPixel(self, x: int, y: int, rgb: Tuple(int, int, int)):
    self.pixels[x][y] = rgb

  def resizeImage(self, scale: float):
    # Not shown for size

  def flipHorizontal():
    # Not shown for size

  def flipVertical():
    # Not shown for size
```

Now that you have this class what you want to be able to do is save and load images from many different file formats in order to do this you add two abstract methods to your class for saving and loading that each file format class will inherit this allows you to reuse all of your flipping and resizing code for any kind of image file you load.

```python
class Image:
  # Previously defined code

  @abstractmethod()
  def save(self):
    pass

  @abstractmethod()
  def load(self):
    pass
```

Then we can inherit these behaviours into our other file baseed image classes

```python
class JPGImage(Image):
  def __init__(self, path: str):
    this.path = path

  def save(self):
    # Implementation calling this to get image data

  def load(self):
    # Implementation calling this to get image data

class BMPImage(Image):
  def __init__(self, path: str):
    this.path = path

  def save(self):
    # Implementation calling this to get image data

  def load(self):
    # Implementation calling this to get image data

class PNGImage(Image):
  def __init__(self, path: str):
    this.path = path

  def save(self):
    # Implementation calling this to get image data

  def load(self):
    # Implementation calling this to get image data
```

So now we can write code that accepts the parent class and any child class will be able to be passed through. This is possible because inheritance guarantees that any method defined on the parent **must** exist on the child.

```python
# This function will work for any child class of Image.
def flip_and_zoom_and_save(img: Image):
  img.resize(2)
  img.flipHorizontal()
  img.save()
```

This appears to be exactly what we want and feels very natural to think about but the flaws of inheritance begin to show them selves when we need to modify our code to handle new features.

Lets say now our application wants to support drawing on an image we still want to use our previous flipping and resizing code but this new kind of image has no associated file type. There are two ways we can solve this design problem either we can just throw an error if the save or load methods are called on our new class or we have to have a new parent class for the file based images to inherit instead of having that functionality be part of the Image class.

Here is the first method:

```python
class DrawableImage(Image):
  def load(self):
    raise Exception("not implemented")

  def save(self):
    raise Exception("not implemented")
```

Second method:

```python
# We remove the abstract methods from the Image class and add them to this class
class FileImage(Image):
  @abstractmethod()
  def save(self, path: str):
    pass

  @abstractmethod()
  def load(self, path: str):
    pass

# Since we have changed the heiarchy we now have to change every reference to the Image class to make our existing code still work

class JPGImage(FileImage):
  # Implementation

class PNGImage(FileImage):
  # Implementation

class BMPImage(FileImage):
  # Implementation

def flip_and_zoom_and_save(img: FileImage):
  img.resize(2)
  img.flipHorizontal()
  img.save()
```

Both methods have pretty big costs with them. The first method requires less refactoring in order to maintain current functionality but now the contract we established with our parent class is a lie. If someone passes a `DrawableImage` to a function that expects the `load` or `save` methods to be defined an exeption will be thrown because those methods don't actually work for our class. The second method solves this problem but it requires a very expensive refactor to change all the established references.

As you can see inheritence seems great initially when you can sit down and define the entirety of your of your design, but this methodology breaks down as soon as you need to change or add features. So now you might be asking is there a better way? Yes it's called composition.

Composition is the idea of instead of inheriting behavior from parent classes we instead build small chunks of behavior and have our classes simply accept these chunks as elements of themselves. Let's look at how we could implment the same ideas from our inheritence solution using composition.

Our image class will still represent an image in memory and have our functions that can flip and scale them. This class now cleanly represents just an image in memory and has no other resposibilities or assumptions.

```python
class Image:
  def __init__(self, width: int = 0, height: int = 0):
    self.setSize(width, height)

  def setSize(self, width: int, height: int):
    self.pixels = [[(0, 0, 0) for x in range(w)] for y in range(h)]

  def getPixel(self, x: int, y: int) -> Tuple(int, int, int):
    return self.pixels[x][y]

  def setPixel(self, x: int, y: int, rgb: Tuple(int, int, int)):
    self.pixels[x][y] = rgb

  def resizeImage(self, scale: float):
    # Not shown for size

  def flipHorizontal(self):
    # Not shown for size

  def flipVertical(self):
    # Not shown for size
```

Now instead of inheriting this class the file classes will only be responsibile for translating an image in memory to a specific file format and vice versa.

```python
class JPGImage():
  def __init__(self, path: str):
    this.path = path

  def save(self, img: Image):
    # Implementation

  def load(self, img: Image):
    # Implementation

class PNGImage():
  def __init__(self, path: str):
    this.path = path

  def save(self, img: Image):
    # Implementation

  def load(self, img: Image):
    # Implementation

class BMPImage():
  def __init__(self, path: str):
    this.path = path

  def save(self, img: Image):
    # Implementation

  def load(self, img: Image):
    # Implementation

# Now for our drawable image requirement we can instead change it so it takes in an image in memory to read and write to without being coupled to how/if that image is saved to disk.
class DrawableImage():
  def __init__(self, img: Image):
    this.img = img

  def resizeImage(self, scale: float):
    self.img.resizeImage(scale)

  def flipHorizontal():
    self.img.flipHorizontal()

  def flipVertical():
    self.img.flipVertical()

  def drawLine(x1: int, y1: int, x2: int, y2: int):
    # Implementation

  def drawCircle(x: int, y: int, r: float):
    # Implementation
```

This looks great but we are still missing something. How do we pass any class that can save/load to a function? This is where interfaces come in, they are simple a list of functions that our class must implement in order to be considered valid. They are typically very small in scope and only have a few methods in them. The powerful thing about interfaces instead of parent classes is that we can more easily break up and allow our code to pick and choose which blocks it wants to reuse without forcing anything extra on top.

**NOTE:** In python these are implemented as abstract classes because it allows for multiple inheritence.

So we can create an interface for our save/load functionality and one for our ability to flip/scale an image.

```python
class FileBasedInterface(ABC):
  @abstractmethod()
  def save(self, img: Image):
    pass

  @abstractmethod()
  def load(self, img: Image):
    pass
```

We can then say that our classes implement these interfaces. This mean that we have successfully allowed each of our classes to take which behavior they want to reuse without being forced to use something irrelevant.

```python
class JPGImage(FileBasedInterface):

class PNGImage(FileBasedInterface):

class BMPImage(FileBasedInterface):

class DrawableImage():

# We split the original function up so each piece is only concered with one interface this makes our code much more reusable and reduces the complexity of individual functions
def resize_and_flip_and_save(img: Image, file: FileBasedInterface):
  img.resizeImage(2)
  img.flipHorizontal()
  file.save(img)
```

You probably noticed our `resize_and_flip_and_save` function has been split into two functions now with each one taking in the interface that describes what a class needs in order for the function to operate correctly. This means now instead of one function that only works under a specific scenario we have two functions that work much more generally allowing us to reuse them in many more scenarios.

This means when we want to use this code in our application we can separate our concerns much more cleanly.

```python
class MyImageAppUI:

  # This UI does not have to care about which kind of file is being passed it only cares that it is able to save or load from disk.
  def __init__(self, file: FileBasedImageInterface):
    self.img = Image()
    self.file = file
    self.file.load(this.img)

  def on_save_button_click(self):
    self.file.save(this.img)

  def on_flip_button(self, vertical: bool):
    if vertical:
      self.img.flipVertical()
    else:
      self.img.flipHorizontal()
```

Hopefully this example has at least given you a good base to understand composition and inheritance and I would encourage you to try both methods in your next project and determine which one makes it easier to maintain and update down the line. In my experience any project that will have it's requirements change overtime will always benefit from being build with composition over inheritance. I'll have full code examples available on my github if you want to see the fully built out code bases to compare and contrast.

Code Examples: [Github Repo](https://github.com/graytonio/blog-code/tree/main/inheritance-vs-composition)
