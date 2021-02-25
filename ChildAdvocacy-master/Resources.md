
### References and resources for the backend stack (C#, ASP.NET CORE, and MYSQL):

**C#:** If you are not already familiar with C# or need a refresher, [here](https://docs.microsoft.com/en-us/dotnet/csharp/) are the docs. You should be able to pick it up pretty easily if you are familiar with C++ or Java.

**ASP.NET core:** [This tutorial](https://www.youtube.com/watch?v=DAOccYTVvLM&list=PLZlxFuSDZDKH01MhPY-AMV3hK25Mo5cx5) is an 'old but gold' video series with [Scott Hanselman](https://github.com/shanselman) walking 
through what asp.net core is and how it works. This includes some basic setup as well as introductions to pipelining, middleware, and more. The best part is that it is geared toward beginners and/or people who are already familiar with the .net ecosystem.
The video series is based on asp.net core 1.0. We are currently targeting production-ready asp.net core 3.1 in our application. (note that 5.0 preview is here but not production ready, so we will stick to 3.1).
If you are interested in what the difference between all of the versions of asp.net core are, check out the [migration section](https://docs.microsoft.com/en-us/aspnet/core/migration/22-to-30?view=aspnetcore-3.1&tabs=visual-studio)
in the asp.net core [docs](https://docs.microsoft.com/en-us/aspnet/core/?view=aspnetcore-3.1).

**MySql:** As for MySql, [here](https://www.tutorialspoint.com/mysql/index.htm) is some great documentation to brush up on some specifics of MySQL as well as SQL. 
We will be using the MySql database library written by Oracle for C# (Oracle's MySql.Data NuGet package).

**Misc:** Aside from all of that, you can look at some boilerplate code already written to get an idea how we are serving up the single page web apps, serving up an api, and also interacting with the database.

### References and resources for the frontend stack (JS, React.js, and misc UI frameworks).
Before we go into some resources relating to the frontend technologies, it is important to know the difference between a **Single Page Application** (SPA) and a **Multipage Application** (MPA).
There are tons of articles out there, so I reccommend giving that a quick internet search.

Also, you can familiarize yourself with JavaScript, EcmaScript vs Common.js. If you are not familiar with JavaScript or any of its supersets or history, here are a few links that will get you pointed in the right direction. 

* https://www.w3schools.com/Js/
* https://stackoverflow.com/a/30113184/3358589
* https://en.wikipedia.org/wiki/JavaScript#History
* https://en.wikipedia.org/wiki/ECMAScript
* https://www.youtube.com/watch?v=it0cwNA46lE&feature=youtu.be

Now, for the main frontend technology, we will be using [React.js](https://reactjs.org/) for our landing page and app portal page. Here are some bullet points on React.js.

* But [why](https://www.c-sharpcorner.com/article/what-and-why-reactjs/) react.js?
* [Here](https://www.w3schools.com/react/default.asp) is a great tutorial. There are also tons of youtube videos out there about react.js.
* Yes, the major downside of React.js is [SEO](https://en.wikipedia.org/wiki/Search_engine_optimization). We can work on server-side rendering the landing page later, if time permits.
* Also, in addition to readable ES6 code, [JSX](https://reactjs.org/docs/introducing-jsx.html) makes it way easier to have HTML-like elements embedded in JavaScript without having to enclose it in strings.
* Where we can, using [functional components](https://reactjs.org/docs/components-and-props.html) with [hooks](https://reactjs.org/docs/hooks-intro.html) is a lot more cleaner than a class-based approach. 

As for any react UI frameworks, we will likely be using [Antd](https://ant.design/components/overview/) and a seperate calendar control that we find.

#### Now, to answer two questions:
1. Why not docker? Well, the answer to this is simple. I did not want to pile on docker as a dependency for this project because I think it would be overwhelming and usually takes a while for a beginner to wrap their mind around it, much less implement it within a dev environment. For our requirements, we were able to common cross-platform tooling.
2. Why not TypeScript? For people just learning about React.js and different dialects of JavaScript, I didn't want to burden our team with having to learn one more superset of js.

If there are any other resources/references that come to mind, I will update this document as we go along. Also, if anybody wants to update this document to include more helpful links, feel free!
