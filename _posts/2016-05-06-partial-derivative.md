---
layout:     post
title:      Journal 3 - Partial Derivative
date:       2016-05-06
summary:    An application of partial derivative - seam carving
categories: journal
---

When Professor Lieblich introduced partial derivative a question immediately came to mind - what can we do with it?
Other than those use cases we already have for derivatives with 1 variable, what does the extra variables/dimensions
enable us to do? I searched for applications of partial derivative and I came across an interesting application in
Computer Science. It turns out partial derivative is critical to the seam carving algorithm, it's an algorithm that
scales (can be extended to perform other modifications as well) image using heuristics. This algorithm was invented by
Shai Avidan and Ariel Shamir in 2005. [Link](https://www.win.tue.nl/~wstahw/edu/2IV05/seamcarving.pdf) to their paper,
if you're interested.

## Background
A problem in resizing image is that, when an image is resized to a different aspect ratio the image looks weird and ugly.
Another problem is that when an image is enlarged it becomes blurry. Seam carving mitigates these problems by scaling
images using a heuristic instead of scaling each pixel uniformly. Seam carving remove/add only those areas that
are the least "important," so that the image as doesn't look too different to human eyes after scaling. There're many ways
to define what's "important," the simplest way is by calculating how different the area is to its neighboring areas.

A digital image is composed of a grid of pixels, which usually has 3 components red, green and blue. Each component
usually has value between 0 and 255. So the image can be described using a function that takes the row and column of a
pixel and return the components of the pixel.

$$f = f(x, y) = <red, green, blue>$$

## The algorithm
1. Calculate the change in color of each pixel with respect to both $$x$$ and $$y$$ directions. This is referred to as
the "energy" function by authors of the algorithm.

    $$E_{x, y} = |\frac{\partial f}{\partial x}(x, y)| + |\frac{\partial f}{\partial y}(x, y)|$$

    Since $$f$$ is just a list of values, we have to use numerical differentiation to find the partial derivatives.
    From the definition of derivative,

    $$f_x(x, y) = \lim_{h\to0} \frac{f(x + h, y) - f(x, y)}{h}$$

    $$f_y(x, y) = \lim_{h\to0} \frac{f(x, y + h) - f(x, y)}{h}$$

    The position of a pixel can only be an integer so the above equations can be simplified to,

    $$f_x(x, y) = f(x + 1, y) - f(x, y)$$

    $$f_y(x, y) = f(x, y + 1) - f(x, y)$$

    This step is the most important step of the algorithm. The energy function determines, what the regions that will be
    modified in the later steps. The energy function shown here is simple yet very effective, other energy function
    can be used to further improve or achieve other effects. For example, we can give the energy function a threshold
    so that the pixel with average energy appear to have the least energy.

    It fascinates me how a function composed of a few simple partial derivatives can play such an important role in this
    game-changing algorithm.

2. Find the seams. Now we know which pixels are the least different comparing to their neighbors (the pixels with
the lowest $$E$$), we can define importance as how much energy the pixel has. A seam is a 1 pixel wide horizontal or
vertical path across the image. The seams can easily be found using shortest path algorithms (e.g. A* search algorithm).
The number of seams depends on how much the image is to be scaled.

3. Remove or duplicate seams. The seams are the least important parts of the image, so changes to those parts are the
least likely to be noticed by human eyes. So to scale up an image, duplicate all the seams. To scale down an image,
remove all the seams. (Or to remove certain regions, scale down then scale up but special energy function is required.)

## Variants of seam carving
As discussed in the previous section, other energy functions can be swapped in to tune the algorithm. This is a very
versatile algorithm, as the energy function dictates what is produced in the end and the energy function can practically
be anything. Seam carving can also be extended to scale videos, in this case the video would be defined has a function
of 3 variables - time, x and y position of each pixel. The additional data dimension, time, opens up even more possibility
for the energy function!

## References
- <https://www.win.tue.nl/~wstahw/edu/2IV05/seamcarving.pdf>
- <https://kirilllykov.github.io/blog/2013/06/06/seam-carving-algorithm/>
- <https://jeremykun.com/2013/03/04/seam-carving-for-content-aware-image-scaling/>
- <https://en.wikipedia.org/wiki/Seam_carving>