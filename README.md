[![ScreenShot](https://github.com/dmolin/domchart-test/blob/master/README/cover.jpg)](http://www.davidemolin.com/labs/mmtest)

A very simple test on how to use DOM elements to create a chart.

When launched, 5 companies are randomly created.

##Implementation details:

- The widget is "responsive". It adapts to the change in size of its container and resizes the graph accordingly, to avoid too much clutter on small screens. It's not thoroughly tested on mobile devices, but it should 'mostly' work

- Circles overlapping has been taken into consideration. Higher grossing companies are always drawn before smaller ones in the DOM, to avoid hiding smaller companies placed in the same chart area.

- Company valuations and revenues are capped at $500 Bn. if a valuation is > $ 500 Bn (and it can be after merge operations), the circle border is rendered in bold, to mark that evidence.

- The X axis of the chart spans from year 1900 to today

- The Y axis of the chart represents revenue values from 0 to 500 Bn

- When opening/refreshing the index.html page in a browser, the BusinessService will randomly create 5 companies that will pre-populate the widget.

##Technologies Used

- I've decided to use **AngularJS** to simulate a real scenario for this functionality (implementing a widget into a wider SPA). As such, I've kept the structure of the code as close as possible to a real scenario, where data is requested and posted to a backend and the chart is implemented as a directive; the Service responsible for handling the data simulates asynchronous requests using promises. That made testing a bit difficult, since the absence of a real backend makes impossible to test the business endpoints (no possibility of mocking a backend without rewriting the entire endpoint under test); That's the reason why I exposed a method like BusinessService._reset().

- Basic Unit Testing suites are present for each Controller/Service/Directive used in this project. The test harness used is Karma+Jasmine+PhantomJs. Spec files have been placed in the same folder where the object under test is; their name is the same as the file under test, postfixed with "Spec.js".

- The code is compiled and assembled into the distribution folder (dist/) by Grunt with a bunch of plugins for activities like copy/concat/templating/minification etc..

- Running the code in "dev" mode will avoid compression and concatenation of all the assets, resulting in a much easier debugging experience.

##To run this project

just clone it and then run the usual: ```npm install``` and ```grunt```

Running `grunt` will compile and run a connect server on port :8000, serving the content of the  **dist/** folder.

A `Watch` task will also run, watching for changes in the code (and a LiveReload server too).

Just open a browser on **[http://localhost:8000](http://localhost:8000)** to see the page.

The code is live (but minified for production deployment) at this address: [here](http://www.davidemolin.com/labs/mmtest)
A non-minified/development version can be seen at this address: [here](http://www.davidemolin.com/tests/graph)

##Do I really need Angular to do this?

Of course not. The same result can also be obtained in a less modular fashion using simple libraries like jQuery (or even vanilla Js if you love to do less and write more). A jQuery version is available in the folder **src-jquery-version**. It's made with the very same code used in the HomeController, the directive and the service. In order to see it in action just open the index.html file or you can head also [here](http://www.davidemolin.com/labs/mmtest/jquery)
