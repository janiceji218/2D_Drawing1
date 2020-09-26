# Running the Code
Check out Albert's how-to for more details on how to get up and running. Here are some high level bits...

#### Pulling the AniGraph submodule 
You will often have to pull submodules. This is easy enough to do; just change directories into the repo folder and run the command:
```shell script
git submodule update --init --recursive
```

----
#### Running the code in server mode
This will build the code and serve the website locally---most likely at [http://localhost:3000/](http://localhost:3000/), but you can check your terminal output to make sure:
```shell script
npm run start
```
The main advantage of running in server mode is hot replacement: when you save changes to the code, the server will automatically update
with those changes. This is definitely faster than rebuilding the static website each time. Also, the server will allow you to attach a debugger,
which you should definitely get used to. The course staff will primarily use WebStorm for debugging; you are welcome to use different tools,
but

#### Building a static website
To build a static version of the code that you can put on your personal webpage, run:
```shell script
npm run build
```
The code should show up in `./dist`. You can open the html files directly on your own machine or you can transfer them to your
webspace and access them through the regular Internet.

-----

