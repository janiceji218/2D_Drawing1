# Assignment 1
Welcome to assignment 1!<br>
In this directory, you'll notice the following files:
- `assignment1.html`: A template that will be used for the landing page of assignment 1. 
The application you create will basically run as a script on top of this html code. 
It's pretty bare-bones, and you shouldn't have to edit it, but it's good to understand what's there.

- `assignment1.jsx`: This will be the entry point for the core component of assignment 1. 
The landing page will run the code in this file. 

- `assignment1.css`: a CSS file for defining styles... you shouldn't need to mess with this.

- `a1create.html`: An HTML template for the creative portion of the assignment. 
It's very similar to `assignment1.html`, but with different navigation.

- `a1create.jsx`: This is the entry point for the creative portion of the assignment. 
Once you have the core functionality working, you'll subclass parts of it to do something new.  

-----
## Where to start:
We suggest checking out `assignment1.jsx`, then moving on to the `README.md` files of each directory in this order:
- [`./src/math`](./math/).
- [`./src/mvc/`](./mvc/)
- [`./src/mvc/views`](./mvc/views/)
- [`./src/mvc/controllers`](./mvc/controllers/)
- [`./src/components`](./components/)
- [`./src/gui`](./gui/) 



## Things you should implement:

#### in A1Model:
- `updateMatrixProperties`
- `setVertices`
- `getVertices`
- `renormalizeVertices`

#### in A1TransformController.js **and** A1TransformCenteredController.js
- `addInteractionsToHandle`
    - `setDragStartCallback`
    - `setDragMoveCallback`
