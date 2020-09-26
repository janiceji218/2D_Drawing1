# Assignment 1
Welcome to Assignment 1! In this assignment, we'll be implementing some of the most fundamental (and common) functionality of graphical software. By the time you are done, you will never look at Powerpoint the same way again...


### Background:
### `AniGraph`
Before we jump into the assignment, we need to say a little bit about `AniGraph`, the Javascript API we will be developing over the course of the semester to do cool graphics stuff... `AniGraph` is a bit of a hybrid between a *Model View Controller (MVC)* framework and a *scene graph*. Scene graphs will be a major focus of assignment 2, so we'll come back to them later. For now, we'll be dealing more with MVC. 

#### Model View Controller (MVC)
MVC is often referred to as a "software architectural design pattern," which just means that it's a common way to design software... Most GUIs are built on some variation of MVC; so, if this is the first time you've heard the term, it probably won't be the last. The basic idea is to separate software into three types of components: *Models*, which contain all of the software's basic data; *Views* which govern how that data is presented to the user; and *Controllers* which facilitate communication between models and views. `AniGraph` provides classes for building models, views, and controllers, which we'll be extending for this assignment.


## Core Assignment:
In the core portion of this assignment we will build a model and two controller classes to create a basic web-based vector graphics editor.  We will do this in two parts: *Object Transformations* and *Transformation Controllers*. 

### Object Transformations:
Almost all graphics software separates the representation of objects from the representation of their environment---typically by representing each object in its own coordinate system and using matrices to transform from one to the next. In this part of the assignment, you will write the code that manages an object's geometry (vertices) and coordinate system (object matrix). For this part of the assignment, you will primarilly work in [`./src/mvc/A1Model.js`](./src/mvc/A1Model.js).

### Transformation Controllers:
Most of the controllers you will write are going to be supplemental controllers. These are a type of controller in `AniGraph` that can be attached to other controllers to add functionality. In this part of the assignment you will write two controllers that add interaction to the bounding box corners and anchor of selected objects (see demo). For this part of the assignment, you will mostly work in [`./src/mvc/controllers/A1TransformController.js`](./src/mvc/controllers/A1TransformController.js) and [`./src/mvc/controllers/A1TransformCenteredController.js`](./src/mvc/controllers/A1TransformCenteredController.js).


### A Note:
This is a new assignment. In fact, we may only be able to use it once:  we may open-source `AniGraph` after this semester, after which hiding parts of its implementation for early assignments will no longer work :-p. This does mean that you will be some of its first users. We have a working solution to this assignment, but documentation may come over time, and in responses to your questions. So please reach out if anything doesn't make sense, and look for answers to appear in updates throughout the week.   

## Getting Started:  
You should only touch code in [`./src`](./src/README.md), so that will be your starting point. 
Each directory (other than `__mocks__` and `./src/static`, which you can ignore for now) has a `README.md` like this one
with instructions and documentation that we will add to based on any questions you have.

If you go to the github page for this code, you will notice that the README.md file for each directory displayed on the page
for that directory. If you view these pages on github, then links to other README.md's will be clickable. That might be a good
way to take a first pass over the code. 

To get started, move on to [`./src/`](./src/). Good luck!

## Submitting:
Please submit your src file as a zip file to CMS. Name your submission "submission.zip".

