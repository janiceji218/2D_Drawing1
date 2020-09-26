# Assignment 1 Model View Controller


## `A1Model`
This will be the model part of MVC for assignment 1. 
It extends `AModel2D`, which extends `AModel` in `AniGraph`.

#### The `AModel` parent class:
Instances of classs that inherit from  `AModel` have a list of model listeners that are notified whenever certain changes are made to the model.
By default, each model has a dictionary of `modelProperties` that automatically update listeners when they are set.

```javascript
    // By default setProperty updates listeners, but this can be suppressed by passing false as a second argument
    setProperty(name, value, update=true){
        // the underscore indicates a private attribute
        this._modelProperties[name] = value;
        if(update) {
            // notifyListeners optionally takes information about what change was made
            this.notifyListeners({
                type: "setProperties",
                args: {name:value}
            });
        }
    }
```

Other objects can add themselves as listeners to be notified whenever a change is made. Any object that adds itself as a listener should implement
the method `onModelUpdate(args)` to be called when the model updates.

#### The `AModel2D` parent class

Instances of the `AModel2D` class have a `this.matrix` model property that describes the coordinate transformation from the object's own local coordinate system ("_object coordinates_")
to world coordinates. This matrix should be a `Matrix3x3` object. We will typically refer to it as the ***object matrix***. 
`AModel2D` objects (and those that extend it) also have the following model properties that should be synched with the object matrix:
- `origin` - a `Vec2` describing where the object's local coordinate system origin is in world coordinates.
- `scale` - a `Vec2`, list, or scalar describing the scale factor betweenworld coordinates and object coordinates. i.e., (size in world coordinates)/(size in object coordinates).
- `rotation` - a scalar describing the rotation of the object coordinate system.
- `translation` - a `Vec2` describing translation to object coordinates applied prior to rotation.

The relationship between these properties and the object matrix can be given by describing what the object matrix does
to points in terms of these properties:
> First, the object matrix translates points by `model.getTranslation()`<br>
> Then, it scales them by `model.getScale()`<br>
> Then, it rotates them by `model.getRotation()`<br>
> Finally, it translates them by `model.getOrigin()` <br>

Remember that we will assume that points are column vectors to be right-multiplied by matrices. This means that, in matrix notation, we would have:<br>
``
M=ORST
`` 
Where `O` is translation by the `getOrigin()`, `R` is rotation by `getRotation()`, `S` is scale by `getScale()` and `T` is translation by `getTranslation()`.

The function `updateMatrix()` shows how the matrix is set given matrix properties.

These matrix properties should remain synched with the object matrix. This means that
Any time a matrix property changes, the object matrix should update, and vice versa.
For convenience, we have implemented get and set functions for each of these matrix properties, with the set functions
triggering `updateMatrix()` to ensure that the matrix is updated.

## What you should implement:
####The Object Matrix and Object Matrix Properties
- `updateMatrixProperties()` - should update `scale`, `translation`, and `rotation` based on the current matrix.
- `setVertices()` - should take a list of vertices in world coordinates and use them to set `objectVertices`,
which should be in object coordinates.

Note that updateMatrixProperties does not change origin. 
This is because different combinations of `origin` and `translation` may define the same matrix.
To disambiguiate, we consider `origin` unchanged by modifications of the object matrix. Why?
Because with the order of transformations we use, `translation` is not defined in world coordinates. Note that different standards can be used in different software, and that the separation of translation and and the origin is only common among mid- to professional-level animation software. We always encourage you to work out solutions to these assignments on your own, but urge extra caution if you decide to consult Google for help on this part of the assignment, as you will likely find answers to a different problem...

####getVertices & setVertices
`getVertices()` and `setVertices()` provide access to the object's vertices in world coordinates,
while letting us store those vertices in object coordinates under the hood. We'll see in lecture why this is useful.
- `getVertices()` should simply return the `objectVertices` transformed into world coordinates. 
- `setVertices()` should take a list of vertices in world coordinates and use them to set `objectVertices`
in object coordinates. 

`setVertices(...)` should also update the model's `objectSpaceCorners` attribute, which
stores the corners (in object coordinates) of an axis-aligned bounding box for our `objectVertices`. 
The corners should be stored in the form:
```javascript
this.objectSpaceCorners = 
[
 new Vec2(minX, minY),
 new Vec2(maxX, minY),
 new Vec2(maxX, maxY),
 new Vec2(minX, maxY)
]
```

#### renormalizeVertices()
Renormalize vertices should:
 - translate and scale the model's objectVertices so that their bounding box is the \[-0.5,0,5\] box.
 - adjust the model's matrix so that the return value of getVertices is not changed by the translation/scaling done inside `renormalizeVertices()`.
 - adjust the model's `objectSpaceCorners` to account for the transformation. 
 This can be done explicitly, or by incorporating a call to `setVertices(...)` in the function.  
 - call `updateMatrixProperties()` to update matrix properties to reflect the new matrix.     

This function should work even if matrix properties have not been set or initialized.
You should only need the current matrix and vertices.
You may assume that `objectSpaceCorners` is accurate, as it should be updated whenever vertices are set.



 


