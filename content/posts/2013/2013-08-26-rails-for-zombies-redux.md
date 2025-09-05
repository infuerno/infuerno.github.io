---
layout: post
tagline: Notes taken on rails for zombies redux course
---
Reference: <http://railsforzombies.org/>

## Level 1: Deep in the CRUD

Hash Recipe: `variable = { key: value }` 
(this is new ruby syntax where `key: value` is short for `:key => value`)

Read Recipe:  `variable[:key] => value`

Rails uses an ORM system to persist objects to a database and allow CRUD operations on this objects.
If a class is called e.g. `Tweet`, then the corresponding database table will be called `tweets`. Ids will be taken care of by the rails framework.
Class methods allow you 

### Create

Create a new object and call `save` to persist it to the database.

	t = Tweet.new
	t.status = "I <3 brains"
	t.zombie = "Jim"
	t.save
	
Alternatively, create the new object using a hash:

	t = Tweet.new(:status => "I <3 brains", :zombie => "Jim")
	t.save
	
Or all in one line using create
	
	Tweet.create(:status => "I <3 brains", :zombie => "Jim")
	

### Read

There are lots of ways to read information from the database:

	Tweet.find(2)		# find by id
	Tweet.find(3,4,5)	# return multiple objects
	Tweet.first			# returns the first tweet
	Tweet.last
	Tweet.all
	Tweet.count			# returns the result of a select count(*) on the database
	Tweet.order(:zombie)	# return the tweets ordered by :zombie
	Tweet.limit(10)		# just 10 tweets
	Tweet.where(:zombie == "Ash")
	Tweet.where(zombie: "Ash")
	Tweet.where(:zombie == "Ash").order(:status).limit(10)
	Tweet.where(zombie: "Ash").order(:status).limit(10)
	

### Update

Update an attribute and resave, or use `t.attributes` to assign a hash with the updates and then save.

	t = Tweet.find(3)
	t.attributes = {:status => "I really <3 brains", :zombie => "EyeballChomper"}
	t.save

Finally the `t.update(hash)` method to automatically update and save the entity back to the database.

### Delete

Delete objects using the method `destroy` on individual objects, or `destroy_all` to obliterate all at once.

	Tweet.find(2).destroy
	Tweet.destroy_all
	

## Level 2: Models taste like chicken

In a rails application stack there are 4 components:
* Views
* Models
* XX
* XX

### Models

Before using the model Tweet the class needs to be defined. This is saved in `app/models/tweet.rb` and defines a class which inherits from `ActiveRecord::Base` which maps the record to the table.

	class Tweet < ActiveRecord::Base
		validates_presence_of :status
	end
	

### Validation

To make fields mandatory use `validates_presence_of`.  
Lots of other validators are availble to validate the model before allowing persistence to the database.

Alternative syntax for Rails 3 allows validations to be combined on a single line:

	validates :status, :presence => true
	validates :status, :length => { :minimum => 3}
	validates :status, :presence => true, :length => { :minimum => 3}

### Associations

To express associations between objects e.g. between `Tweet`s and `Zombie`s there are the keywords `belongs_to` and `has_many` :

	class Tweet < ActiveRecord::Base
		belongs_to :zombie # note - this is singular
	end

	class Zombie < ActiveRecord::Base
		has_many :tweets
	end
	

This relationship may be specified in one direction only (either way), or both.

To save a new tweet, retrieve the required zombie and then use create, passing in this zombie.

	z = Zombie.find(3)
	t = Tweet.create(:status => "Your eyelids taste like bacon", :zombie => z)

## Level 3: The views ain't always pretty

The Ruby application stack has 4 components, Models on the bottom and Views second from the top.
Rails applications are organised by folder:

* app
	* views
		* layouts
			* application.html.erb # main layout boilerplate html code (headers etc)
		* zombies
		* tweets
			* index.html.erb # lists all tweets
			* show.html.erb # views one tweet
	* models 
* public
	* stylesheets
	* javascripts
	* images

`.erb` stands for Embedded Ruby, which embeds ruby code inside html

### Tags used in html files

`<% %>` to evaluate Ruby  
`<%= %>` to evaluate Ruby and print the result  
To indicate where to add the main content in the application.html.erb template file use `<%=yield%>`  

### Additional layout components

`<%= stylesheet_link_tag :all %>` will write out the appropriate html to include all stylesheets in the public/stylesheets directory  
`<%= javascript_include_tag :defaults %>` will include all the default javascript (jquery from Rails 3.1)
`<%= csrf_meta_tag %>` cross site request forgery meta tag will add meta tags to the top of the doc and other tags to forms

### Root path and images

When a resource is requested by the browser it will automatically be searched for in the `public` folder first. If not found, the request will be sent to Rails.

### Adding a link

To add a link use `<%= link_to [link text], [link path url] %>`  
So to link to the page for that zombie use e.g. `<%= link_to tweet.zombie.name, zombie_path(tweet.zombie) %>`  
This can alternatively be written  `<%= link_to [link text], [object to show] %>`  
e.g. `<%= link_to tweet.zombie.name, tweet.zombie %>`  

### Getting more info from the API documentation

There are many options you can use with the method `link_to`.
In order to find more information about this method:

1. `git clone` the rails code and use grep to search for that method name: `grep -rin 'def link_to'`
2. Use the online documentation at <http://api.rubyonrails.org>
3. Searchable online documentation with comments at <http://apidock.com/rails>
4. Use the rails searchable API doc at <http://railsapi.com>

### link_to paths

When using `link_to` there are various macros to generate the correct RESTful style / MVC style url.

* `tweets_path` to show all the tweets (`/tweets`)
* `new_tweet_path` to go to the page to add a new tweet (`/tweets/new`) 
* `tweet_path(tweet)` or just `tweet` to go to the page for that tweet (e.g. `/tweets/1` or `tweets/1/show`)
* `edit_tweet_path(tweet)` to go to the edit page for that tweet (e.g. `/tweets/1/edit`)
* `tweet, :method => :delete` to delete a tweet (generates `/tweets/1`)

These all follow the recipe:
`<%= link_to text_to_show, code %>`

## Level 4: Controllers must be eaten

In the Ruby application stack, Models is at the bottom, then Controllers and then Views second from top. All requests initially go to the controller.

* app
	* models
	* views
	* controllers
		* tweets_controllers.rb
		
### Naming conventions

The name of the controller `tweets_controller` matches the path in the url `/tweets/`. 

The controller class method name `show` also indicates the view which should be rendered, `show.html.erb`.

	class TweetsController < ApplicationController
		def show
			@tweet = Tweet.find(params[:id])
		end
	end
	
There is a way to override the name of the view which will be rendered by using the following code inside the controller method:

	render :action =>  'status' # will render a view call status.html.erb
	

### Variable scope

All calls to the model will be moved from the view to the controller. Now the view code doesn't contain lots of Ruby code. The code in the controller action method will be executed and control passed to the view. Any variables required by the view will be marked with a `@`. The `@` symbol is then used both within the controller code and the view code.

### Parameters

Parameters in the query string GET variables or in the POST variables are passed to the controller in a hash called `params`.
There are often nested hashes within the `params` hash (i.e. called with e.g. /tweets?tweet[status]=I'm dead)

	params = {:tweet => {:status => "I'm dead"}}
	
To extract this value we can use `params[:tweet][:status]`.

When creating a new tweet with this status, the code would be:

	@tweet = Tweet.create(:status => params[:tweet][:status])
	
or alternatively, just pass the hash from the params into the create method:
	
	@tweet = Tweet.create(params[:tweet])
	

NOTE: In Rails 4 strong paramters are required. This means in the controller you need to specify which models are required and which paramters for that model are permitted. Only required for creates or updates.

### Generating xml and json formats

By default in ruby the convention for requesting the output in a different format is to append `.xml` or `.json` on the end of the url e.g. `/tweets/1.xml`.

In the controller, the `respond_to` keyword is used:

	class TweetsController < ApplicationController
		def show			
			@tweet = Tweet.find(params[:id])

			respond_to { |format| 
				format.html # show.html.erb
				format.xml { render :xml => @tweet }
				format.json { render :json => @tweet }
			}
		end
	end

This will automatically render the tweet in either xml or json.

### Common controller actions

	class TweetsController < ApplicationController
		def index 	# show all items
		def show		# show a single item
		def new 		# show a create form
		def edit 		# show an edit form
		def create 	# create a new item
		def update 	# update an item
		def destroy	# delete an item
	end
	
### Authorisation

The session hash can be used to store e.g. the user's id and restrict edits to items only this user has created.

	class TweetsController < ApplicationController
		def edit
			if session[:user_id] != @tweet.zombie_id
				flash[:notice] = "Sorry, you can't edit this tweet"
				redirect_to(tweets_path)
			end
		end
	end
	
The flash hash is used to send messages to the user. To redirect the user back to a different controller, use the `redirect_to` method.

In Rails 3 the redirection and notice can be combined:

	redirect_to(tweets_path, :notice => "Sorry, you can't edit this tweet")
	
### Common code for several actions

If there is common code which is called in several actions, this can be extracted to its own method.
This method can be called by using the `before_filter` command which can specify a method to execute, as well as conditions when the method should be executed.

	before_filter  :get_tweet, :only => [:edit, :update, :destroy]
	before_filter  :check_auth, :only => [:edit, :update, :destroy]
	
	def get_tweet
		@tweet = Tweet.find(params[:id])
	end
	def check_auth
		if session[:user_id] != @tweet.zombie_id
			redirect_to(tweets_path, :notice => "Sorry, you can't edit this tweet")
		end
	end

## Level 5: Routing into darkness

The final component in the ruby application stack is routing, sitting right at the top. Routes are required to properly find the paths for the link_to functions and find the actions.

They are defined in a file called routes.rb in the config directory.

* app
	* models
	* views
	* controllers
* config
	* routes.rb
	
This file contains code to create a RESTful resource to generate several default routes:

	ZombieTwitter::Application.routes.draw do |map| 
		resources :tweets
	end

### Custom routes

To specify custom routes:
	
	match 'new_tweet' => 'Tweets#new' # controller Tweets, action new
	match 'all' => 'Tweets#index'
	
However, once you do this the usual `tweets_path` will still direct to `/tweets` instead of `/all`. We can define a path which will redirect to `/all` as part of the route, which we can then use with link_to.

	match 'all' => 'Tweets#index', :as => 'all_tweets"'"

	<%= link_to 'All tweets', all_tweets_path %>
	
### Redirects

Alternatively we may want to keep `/tweets`, but redirect to this if someone enters `/all`. This is done using the `redirect` keyword:

	match 'all' => redirect('/tweets')
	match 'google' => redirect('http://www.google.com')

The second example shows this mechanism being used to redirect outside of the application.

### Root route

Specify where the root of the application default to using the root route.

	root :to => "Tweets#index"
	
Correspondingly the link_to is:
	
	<%= link_to "All tweets", root_path %>
	
### Route parameters

By default a number after an action in the url is assigned to a variable called `id`, but an alternative variable name can be specified in the routing.

	match "local_tweets/:zipcode" => "Tweets#index"
	
Another example uses a variable without specifying any controller (as in e.g. <http://www.twitter.com/user3>)

	match ":name" => "Tweets#index"