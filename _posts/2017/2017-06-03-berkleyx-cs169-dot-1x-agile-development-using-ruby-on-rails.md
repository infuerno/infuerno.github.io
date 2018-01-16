---
layout: post
title: "BerkleyX: CS169.1x Agile Development Using Ruby on Rails"
---

## Chapter 1: Introduction to SaaS and Agile Development
### References
[Students - Engineering Software as a Service: An Agile Approach Using Cloud Computing](http://www.saasbook.info/students)
http://www.akitaonrails.com/2017/01/10/arch-linux-best-distro-ever
http://rubular.com


### Plan and Document
* Create a plan and detailed documentation
* Start building the software, measuring progress against the plan
* If changes required in the project, update the plan and the documentation

#### Waterfall - Software Development Lifecycle (1970)
1. Requirements and Analysis
2. Architectural design
3. Implementation and Integration
4. Verification
5. Operation and Maintenance

> “And the users exclaimed with a laugh and an taunt, its just what we asked for, but not what we want”  

Often when the customer sees a SW product, they want to change it.

#### Spiral Lifecycle (1986)
Combines Plan and Document with prototypes.
1. Determine objectives and contraints
2. Evaluate alternatives and identify risk
3. Develop and verify prototype
4. Show to customers, get feedback, next iteration

Iterations involve the customer so there is feedback, but iterations tend to be approx six months. Each iteration requires documentation, so lots of it. Various rules e.g. can’t skip between phases. Gets expensive and proves to be hard to meet the project and 

#### Rational Unified Process (2003)
1. Inception - business case, schedule, budget
2. Elaboration - identify use cases, design an architecture, outline development plan, build prototype
3. Construction - code and testing, first external release
4. Transition - move from development to production, customer acceptance testing, user training

### Agile Manifesto (2001)
We have come to value:
* Individuals and interactions over processes and tools
* Working software over comprehensive documentation (direct jab at Plan and Document approach)
* Customer collaboration over contract negotiation
* Responding to change over following a plan

### When to use Plan and Document
Ian Sommerville - Software Engineering,10th Edition
1. Is specification required?
2. Are customers unavailable?
3. Is the system to be built large?
4. Is the system to be built complex (e.g. real time)?
5. Will it have a long product lifetime?
6. Are you using poor software tools?
7. Is the project team geographically distributed?
8. Is the team part of a document-oriented culture?
9. Does the team have poor programming skills?
10. Is the system to be built subject to regulation?

### Legacy Code
Old software which continues to meet customer's needs but which is difficult to evolve.

### Quality
Satisfying the customers needs, easy to use, gets correct answers, does not crash AND easy for the developer to debug and enhance.

:Verification
Did you build the system as it was asked for (i.e. did you meet the specification)?

:Validation
Did you build the right thing (i.e. does it do what the customer wants, or is the specification right?)

## Chapter 2: The Architecture of SaaS applications

### Client-Server Architecture

SaaS web apps are examples of client server architecture.
Client - specialised in interacting with the user and sending requests to a server e.g. web browsers: Firefox, Safari
Server - specialised in handling large volumes of client requests e.g. web servers: Apache, IIS

### Communication - HTTP and URIs

Clients and servers communication using HTTP which in turn relies on TCP/IP. Each computer has an IP address and via DNS to translate a hostname to the equivalent IP address, the browser and server communicate to send and receive packets. TCP/IP additionally uses port numbers from 1 to 65535 (i.e. 16 bits) to distinguish different network agents at the same IP address.

An HTTP request consists of an HTTP method and a URI. HTTP is a stateless protocol. Cookies and session are used to track state. It is the browser's responsibliity to ensure the correct cookies are sent with each request.

### Representation - HTML and CSS

An HTML document of tags and optional attributes determine the structure of a web page. Selectors identify one or more elements. CSS describes visual attributes of HTML elements using selectors. A CSS stylesheet is associated with an HTML document using a special link element in the header of the HTML document.

### 3-Tier Architecture and Horizontal Scaling

Web apps are structured as 3 logical tiers:

* Presentation tier: HTTP or Web server which accepts requests and serves static assets
* Logic tier: receives requests from the Web server for any dynamic content. An application server hides the low level mechanics of HTTP from the application  or application framework, e.g. Rack. The application server needs to be able to handle the particular application code
* Persistence tier: e.g. database to store state

All 3 tiers can be deployed to one server, or to seperate servers. Each tier can then be scaled out as required using load balancers. The persistence tier can only by psuedo scaled by e.g. adding several copies of the data to slave servers which deal only with reads and use the master only where writes are required (with the master updating the slaves as quickly as possible following a write).

Shared-Nothing architectures - no state shared, so horizontal scaling is possible.

### Model-View-Controller Architecture

Each entity has a *Model*, a *Controller* and one or more *View*s.

* Models: concerned with data manipulated by the application
* Views: presented to the user, show information about the models
* Controllers: mediate the interaction in both directions, when a user clicks on a view and afterwards when returning a different view back to the user

MVC is used by Ruby on Rails and Java Spring.

There are various other design patterns which are used by various other frameworks:

* Template View - a pattern suited to mostly static content (PHP)
* Page Controller - good for applications structured with a few distinct pages, with each page effectively having its own controller (e.g. Sinatra)
* Front Controller - various pages, but few models (J2EE servlets) - one dispatch factory which everything comes through

### Active Record for Models

Many design patterns exist to persist objects to structured storage, especially RDBMSs. The Active Record architectural pattern correlates an instance of an entity with a row in a database table. In ActiveRecord, every model knows how to CRUD itself using common mechanisms.

The schema is the structure of the database tables, columns etc.

#### DataMapper

This is an alternative to ActiveRecord and associates a seperate mapper with each model. This keeps the database representation independent (used by Google AppEngine). One of the advantages is that it allows the storage system to reach much larger scale.

### Routes, Controllers and REST

The mapping of an HTTP request to an individual controller and action (method) is a *route*. REST identifies the entities to be manipulated as *resources* and designs routes so that an HTTP request can identify both the resource and the action to be performed on it. e.g. a request to get the current contents of a shopping cart also needs to contain a user id (rather than relying on information retained in e.g. a session about which user is logged in).

A resource could be e.g. a movie, a list of movies a list of movies matching a certain criteria - these are all resources.
URIs (and REST) should express resources and the things you want to do them in a self contained manner.

If you have a web service which follows these principles then this is a RESTful service and has a RESTful API.

Browsers only implement the verbs GET and POST. Rails compensates for this by annoting forms that should instead use PUT or DELETE and then translating this to the correct HTTP method "seen" by the controller.
Should think about this as a "service" rather than just a UI for a browser. 

REST vs SOAP vs WS-* (WS-DeathStar)

#### Intro to Rails subsystem

* Dispatch <method, URI> to correct controller action
* Provide helper methods that generate <method, URI> pair given a controller action
* Parses query paramters from both URI and form submission into a convenient hash
* Built-in shortcuts to generate all CRUD routes (as a good starting point)

What happens when a browser generates a "GET /movies/3/edit HTTP/1.0" request?

1. Matches route in the route table
2. Parse any wildcard paramters and add to a hash (in this case `params[:id] = 3`)
3. Dispatch to the `edit` method in the `movies_controller.rb`
4. Include a URI in the generated view which will submit the form to the correct update controller action. You specify the resource and the operation, rails generates the URI for you (in case you change your routing scheme).

### Views
#### Templates Views

Views which have static content interspersed with dynamic content via variables or brief snippets of code.

Haml OR Erb together with a Closure (application state) -> Renderer (Action-View) to output HTML

#### Transform Views

Alternative. Closure (represents what you want to display to the user) plus the data and this is then rendered - without any particular template. This could be used to render JSON or XML.

#### HAML

HTML on a diet. 

* Use % rather than angle bracket. 
* Indentation is used to indicate scope (so no `end` required on a `do`)
* Attributes `class` and `id` are represented by `.` and `#` respectively.
* `-` means execute this code
* `=` means subsitute the result of running this code directly into the template
* `|` to join two lines (making it deliberately awkward to put code in the views - but shouldn't be doing that). Move important manipulations to the model. Use helpers to make things pretty for views.

### Summary

#### Patterns

Client-Server v Peer-to-Peer
Shared-nothing (Cloud Computing) v Symmetric multiprocessor, shared global address space
Model-View-Controller v Page Controller, Front Controller, Template View
Active Record v Data Mapper
RESTful URIs (all state affecting request is explicit) v Same URI does different things depending on internal state

## Chapter 3: Introduction to Ruby for Java Programmers (!!!)

* Everything 

## Chapter 4: ?

Ruby's null reference error: `Undefined method foobar for nil:NilClass`. Hard to find if a null object is sent from the controller to the view. Should check for valid objects in the controller.

### Debugging

Within rails apps, `print` or `puts` for rudimentary debugging doesn't work since a rails app is not attached to a console.

Use `@movie.inspect` or `debug(@movie)` in a view to details about a particular object.

`raise params.inspect` will throw an error displaying the content of params as well as other useful information around e.g. the request and the response details.

`logger.debug(message)` will print a message to the log file (found under the logs directory - default level is via the configs)

`byebug` uses the byebug gem and will set a breakpoint wherever this is inserted into the code. The interactive prompt will open here to allow debugging interactively.

### Database migrations

Run `rake db:migrate` to run any migrations not yet run and update the internal record of which migrations have been run. A local schema.db file is also updated to detail the current database schema (this file needs to be under version control).
Run `rake db:test:prepare` to get the test database schema in sync with the development environment (having already run the migrations there).
Run `rake db:seed` to seed the database using `db/seeds.rb`
Run `rake -T <task>` to get information on any rake task

### Models

Having created a database table, ActiveRecord models query the database at run time and any columns become the getters and setters available on that model.

### Active Record Basics

* Create `Movie.create! :title => 'Star Wars', :rating => 'PG'` - can use `create!` interactively, but more common to use `create` in applications and then check for `nil` afterwards (meaning something went wrong)
* New and Save `mv = Movie.new ; mv.save!` - again use `save` and check for `nil` more common in applications
* Update 1 `mv.title = 'Start Wars'; mv.save!` (or `save`)
* Update 2 `mv.update_attributes(:Title => 'Start Wars'` to update immediately
* Delete `mv.destroy`
* Find `Movie.find(3)`, `Movie.all`
* Search `Movie.where("rating = 'PG'")` *BAD*
* Search 2 `Movie.where("rating = ?", 'PG'` *GOOD* - this is the parameterised version

### Controllers and Views

 Helper Method | URI returned | RESTful route | RESTful action
--- | --- | --- | --- |
movies_path | /movies | GET /movies | index
new_movies_path | /movie/new | GET /movies | new
movies_path | /movies | POST /movies | create
movie_path(m) | /movies/1 | GET /movies/:id | show
edit_movie_path(m) | /movies/1/edit | GET /movies/:id/edit | edit
movie_path(m) | /movies/1 | PUT /movies/:id | update
movie_path(m) | /movies/1 | DELETE /movies/:id | destroy

### Strong parameters

Rails' strong parameters mechanism require us to declare which values from the `params` object are required to be present and which are permitted, so stop malicious attackers changing variables which shouldn't be settable by normal users. This follows the _principle of least privilege_.

### Flash

`flash[]` has hash like functionality to store message. `flash[:notice]` and `flash[:warning]`

`flash[]` is a special case of `session[]`. By default both are stored in a cookie and so have a limited size. Alternatively it could be stored in a database e.g. a NoSQL system like memcached. HOWEVER, if you are storing a lot in the session, likely the design of the application is becoming unRESTful.

## Chapter 9

### Smells and Metrics

#### Qualitive 

SOFA - Short, One thing, Few arguments, Abstraction
*reek* - rails tool for checking for code smells
Lots of arguments - makes it hard to get good test coverage - hard to mock while testing
Boolean arguments which determine different functionality - should refactor to two methods
Arguments travelling in a pack - extract to a seperate class

#### Quantitive: ABC complexity

Counts number of assignments, branches and conditions
Score =  square_root(a^2 + b^2 + c^2)
Government contracts specify this should be <= 20
*flog* - rails tool checks the ABC complexity

#### Quantitive: Cyclomatic complexity

Number of linearly independent paths through a piece of code calculated using E-N+2P where N=Nodes, E=Edges, P=Connected Components
Governement says CC <= 10 per module
*saikuro* - rails tool to calculate the C

#### Coverage

Aim to get above 90%, tools for Rails / Ruby is SimpleCov

#### Ratio of code to tests

Aim for 1:2 i.e. twice as much testing code as actual code
(*rail stats*)

### Behavioural Driven Design

#### Key features

[list in kindle book]

Ask questions before and during development - about validation (not verification). Requirements written down as User Stories. Captures behaviour rather than implementation (TDD deals with implementation)

FEATURE
As a ... [kind of stakeholder]
So that ... [I can achieve some goal]
I want to ... [do some task]

Different stakeholders may see the same kind of functionality differently.

Product backlog - user stories not yet completed - prioritized with most valuable items highest - organise so they match SW releases

Spike - quick investigation - after spike, code must be thrown away

### Scenarios

Scenarios should have 3 to 8 steps
Explicit scenarios come from the User Story - become acceptance tests
Implicit scenarios are things that need to be figured out - e.g. which order to list films (if not previously specified)
Imperative: Inital user stories with many steps (not DRY)
Declarative: State we want it to be

GOOD EXAMPLE
Feature: moves when added should appear in the movie list
Scenario: view movie list after adding movie
Given I have added "Zorro" with rating "PG-13"
And I have added "Apocalypse Now" with rating "R"
Then I should see "Apocalypse Now" before "Zorro" on the home page

3 steps - 2 steps to set up the test - 1 step for behaviour - focuses on the behaviour - not the steps to get there.

Often have to start imperatively and then extract common sets of steps, so that you can reuse and end up declaratively.

### Cucumber

Feature files - the feature with its scenarios and the steps comprising each scenarios - language is from the 3x5 card
Step definitions - ruby code which correspond to the steps in the scnarios - a single step definition can be used by many steps. Cucumber matches the step to the appropriate step definision using regex 



