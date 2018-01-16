---
layout: post
title: Why's Poignant Guide To Ruby
tagline: Notes from an esoteric guide to Ruby
---
Reference: <http://mislav.uniqpath.com/poignant-guide/> and <http://poignant.guide/book/>

## Chapter 2 Kon’nichi wa, Ruby

>This book is a poignant guide to Ruby. That means code so beautiful that tears are shed.

Three reasons to learn Ruby:

1. Brain Health

>Creative skills, people. Deduction. Reason. Nodding intelligently. The language will become a tool for you to better connect your mind to the world. I’ve noticed that many experienced users of Ruby seem to be clear thinkers and objective. (In contrast to: heavily biased and coarse.)

2. One man on an island

>Ruby was born in Japan. Which is freaky. Japan is not known for its software. And since programming languages are largely written in English, who would suspect a language to come from Japan?
>It’s triumphant and noble and all that. Support diversity. Help us tilt the earth just a bit.

3. Free

>Using Ruby costs nothing. The code to Ruby itself is open for all of the world to inhale/exhale. Heck, this book is free. It’s all part of a great, big giveaway that should have some big hitch to it.

>With that, it’s time for the book to begin. You can now get out your highlighter and start dragging it along each captivating word from this sentence on. I think I have enough hairspray and funny money on my person to keep me sustained until the final page.

## Chapter 3 A Quick (and Hopefully Painless) Ride Through Ruby (with Cartoon Foxes)

### The parts of speech

Part | Notes | Examples 
---|---|---
Variables | Plain, lowercase words consisting of letters, digits and underscores | `x`, `y`, `banana2`, `phone_a_quail`
Numbers | Integers or floats, plus or minus, floats have decimal places and can be written in scentific notation | `2`, `-10000`, `3.14`, `12.043e-04`
Strings | Any sort of characters surrounded by quotes | `"sealab"`, `'2021'`, `"These cartoons are hilarious!"`
Symbols | Words looking like variables, starting with a colon, lightweight strings usually used when you won't be printing the string to the screen | `:a`, `:b`, `:ponce_de_leon`
Constants | Like variables but capitalised, warning if you try to change initial value | `Time`, `Array`, `Bunny_Lake_is_Missing`
Methods | Verbs, usually attached to the end of variables by a dot, can be chained, both exclamation marks and question marks can be used in method names | `open`, `close`,  `front_door.open.close`, `is_open?`
Method arguments | Arguments are attached to the end of a method surrounded by parentheses and separated by a comma | `front_door.paint( 3, :red )`, `front_door.paint( 3, :red ).dry( 30 ).close()`
Kernel methods | Common methods, don't usually use parentheses | `print "See, no dot."`
Class methods | Usually attached after variables and constants, joined by a double colon | `Door::new( :oak )`
Global variables | Variables beginning with `$` | `$x`, `$1`, `$chunky`, `$CHunKY_bACOn` 
Instance variables | Variables beginning with `@`, often used to define the attributes of something | `@width`
Class variables | Variables beginning with `@@`, defines an attribute for all objects in a class (@@ = attribute all) | `@@x`, `@@y`, `@@i_will_take_you`
Blocks | Any code surrounded by curly braces or `do` and `end` | `2.times { print "yes, never again" }`
Block arguments | A set of variables surrounded by pipe characters, used at the beginning of a block | 
Ranges | Two values surrounded by parentheses and separated by an ellipsis, a third dot indicates that the final value is not included | `(1..3)`, `('a'..'z')`, `(0...5)`
Arrays | A list surrounded by square brackets, a collection of things, but kept in a specific order | `[1, 2, 3]`, `['coat', 'mittens', 'snowboard']`
Hashes | A dictionary surrounded by curly braces, matches words to definitions | `{'a' => 'aardvark', 'b' => 'badger'}`
Regular expressions | Regex surrounded by slashes | `/ruby/`, `/[0-9]+/`, `/^\d{3}-\d{3}-\d{4}/`
Operators | Required for maths or comparing things | !  ~  *  /  %  +  -  &
Keywords | Ruby has a number of built-in words, imbued with meaning | `return`, `self`, `super`

## Chapter 4 Floating Little Leaves of Code

>By the end of this chapter, you will know Ruby’s beauty. The coziness of the code will become a down sleeping bag for your own solace.

### Animal perfect mission statement

	blue_crystal = 1
	leaf_tender = 5
	
>The equals sign is used for assignment. **This concept right here is half of Ruby**. We’re defining. We’re creating. This is half of the work. Assignment is the most basic form of defining.

	pipe.catch_a_star

>Variable `pipe`. Method `catch_a_star.` A lot of Rubyists like to think of methods as a message. Whatever comes before the dot is handed the message. The above code tells the `pipe` to `catch_a_star`.
>**This is the second half of Ruby**. Putting things in motion. These things you define and create in the first half start to act in the second half.

	captive_star = pipe.catch_a_star

>It’s up to you to collect the miserable, little star. If you don’t, it’ll simply vanish. 

	starmonkey = ratchet.attach( captive_monkey, captive_star )
	starmonkey = ratchet.attach( captive_monkey, pipe.catch_a_star ) + deco_hand_frog

### Nil

`nil` represents emptiness, without value. It is **not** undefined, Ruby knows about it, and it is `nil`.

### False

`nil` and `false` are the only two negative concepts in Ruby.  
Everything else is positive.

	if plastic_cup
	  print "Plastic cup is on the up 'n' up!"
	end

If `plastic_cup` is either `nil` or `false`, nothing will be printed.

	unless plastic_cup
	  print "Plastic cup is on the down low."
	end

Conversely using `unless` will only print to the screen if `plastic_cup` is either `nil` or `false`.

`if` and `unless` can also be used at the end of a line of code:

	print "Yeah, plastic cup is up again!" if plastic_cup
	print "Hardly. It's down." unless plastic_cup

or combined:
	
	print "We're using plastic 'cause we don't have glass." if plastic_cup unless glass_cup
	# do this only if a is true and b isn’t true.
	
### Double equals is a method

	approaching_guy.==( true )
	
This method will return true or false. It is the same as using `==` 

	if approaching_guy == true`...

Assignment can be used in conjunction with if:

	at_hotel = true
	email = if at_hotel
	          "why@hotelambrose.com"
	        else
	          "why@drnhowardcham.com"
	        end
			
If there are several lines of code in the `if` statement **only the answer from the last full statement will be used**.

### << is the concatenation operator

	address = "5 Oxford Street"
	address.<<(", London") # OR address << ", London"
	
### nil?

The `nil?` method can be used on any value in Ruby. Obviously if value is either `true` or `false`, then it is not `nil`. `nil` is again, not the same as undefined.  

If you use a variable without declaring it, a `NameError` exception will be thrown.

### Hashes

A value from a hash or dictionary of code words can be retrieved using the `[]` method.

	code_words.[]( 'catapult' ) # OR code_words['catapult']

### File operations

	require 'wordlist'
	
	# Get evil idea and swap in code words
	print "Enter your new idea: " 
	idea = gets
	code_words.each do |real, code|
		idea.gsub!( real, code ) 
	end
	
	# Save the jibberish to a new file
	print "File encoded. Please enter a name for this idea: " 
	idea_name = gets.strip
	File::open( "idea-" + idea_name + ".txt", "w" ) do |f|
		f << idea 
	end

This starts with the kernel method `require` which can be used anywhere and will pull in the contents of an external file, in this case called wordlist.rb. 

Input from the terminal is stored in `idea`, and then for each entry in the dictionary a replacement is done using `gsub!`, short for _global substitution_, used for search and replace

The `each` method is available for Arrays, Hashes and Strings and in this case will iterate over each pair in the hash.

The coded idea is then saved to a file. It is important to call `strip` on the input from `gets` since this will remove the `\n` on the end.

The class method `File::open` is used to create a new file. In fact all the kernel methods so far mentioned are actually class methods. 

	Kernel:: print( "hello world" )

>What does this mean? Why does it matter? It means `Kernel` is the center of Ruby’s universe. Wherever you are in your script, `Kernel` is right beside you. You don’t even need to spell `Kernel` out for Ruby. Ruby knows to check `Kernel`.

The `File` class contains many methods to read, rename, delete etc files. The `File::open` method takes two variables, the filename and the file mode:

* `w` to write to a new file
* `r` to read from a file
* `a` to append to a file

The file is opened and a variable is returned to represent the file, in this case called `f`. We can use the operator `<<` to write to the file, since this method is defined on files.

	require 'wordlist'

	# Print each idea out with the words fixed
	Dir['idea-*.txt'].each do |file_name| 
		idea = File.read( file_name ) 
		code_words.each do |real, code|
			idea.gsub!( code, real ) 
		end
		puts idea
	end
	
`Dir[path]` searches a directory and returns a list of all matching files in the directory specified. This is an alternative for `Dir.[](path)` which is an alternative for `Dir::[](path)`.
`File.open` is alternative syntax for `File::open`.

Although the `.` notation can also be used for class methods, using `::` makes it more obvious that you are using a class method rather than an instance method.

### p
`p` is similar to `print` and `puts`, but will display anything (where `print` is only designed for displaying strings).

>`p foo` does `puts foo.inspect`, i.e. it prints the value of `inspect` instead of `to_s`, which is more suitable for debugging (because you can e.g. tell the difference between 1, "1" and "2\b1", which you can't when printing without inspect).  
>Ruby documenation: <http://www.ruby-doc.org/core-2.0.0/Kernel.html#M005961>  
>Note that `p` also returns the value of the object, while `puts` does not. 
Reference: <http://stackoverflow.com/questions/1255324/p-vs-puts-in-ruby>

### ::methods

This method will list all the methods available on an object

### Using hashes as quick and dirty custom data structures

Define a custom class `kitty_toy` which has a `:shape` and a `:fabric`. Then instantiate a number of these, put them in a list and then sort them according to one attribute or another.

Alternatively create several hashes with the same keys, add these to a list and sort according to common keys in each hash.

	kitty_toys = [
	  {:shape => 'sock', :fabric => 'cashmere'},
	  {:shape => 'mouse', :fabric => 'calico'},
	  {:shape => 'eggroll', :fabric => 'chenille'}
	]
	kitty_toys.sort_by { |toy| toy[:fabric] }

This will throw an `ArgumentError` if one of the hashes does not contain this key.


The `sort_by` method is an **iterator** which will iterate through the list of hashes.

### next

`next` will let you skip onto the next item in an iteration.

	non_eggroll = 0
	kitty_toys.each do |toy|
	  next if toy[:shape] == 'eggroll'
	  non_eggroll = non_eggroll + 1
	end

### break

`break` kicks you out of an iterating loop altogether.

	kitty_toys.each do |toy|
	  break if toy[:fabric] == 'chenille'
	  p toy
	end

## Chapter 5 Them What Make the Rules and Them What Live the Dream

### case..when

Either with or without else

### ===

The triple equals checks equality in a _flexible_ way. It depends on context.
`(1895..1913) === 1896` is true.
`(1895..1913) === 2008` is false.

### scope

Variables declared outside of methods cannot normally be seen inside them. Blocks **do** see variables outside of them. Block arguments do not exist outside of the block. 

**Note** If block arguments are named the same as an existing variable, the contents of the variable will be overwritten and the variable available with the changed argument after the block exits.

`@` denotes an instance level variable, available to all methods in that instance.
`@@` denotes a class level variable, available to all instances of that class.
`$` denotes a global variable, available everywhere.

### def and class

`def` is used to define a method.

`class` is used to define a class.

Everything in ruby is an object and the `class` method will return the name of the class of any object.

	print 5.class							# prints 'Integer' 
	print 'wishing for antlers'.class	# prints 'String' 
	print WishMaker.new.class			# prints 'WishMaker'

### Inspecting metadata

`Object::constants` will list all top-level constants. This will also list all loaded classes.  
`Hash::methods` will list all the methods of a certain class  
`Hash::class_variables` lists the class variables  
`Hash::constants` lists the constants for a particular class  

### Checking method arguments

It is good practice to check any method arguments. `include?` works fine with strings, arrays, hashes etc but this method is not defined for a number, so will throw an exception. 

Rather than checking the type of the argument, you can just check if a certain method is defined for that type using `responds_to` (which returns `true` or `false`).

	def wipe_mutterings_from( sentence ) 
		unless sentence.respond_to? :include?
			raise ArgumentError,
			"cannot wipe mutterings from a #{ sentence.class }"
		end
		...
	end

#### Using symbols

In the example above a symbol `:include` was used. Symbols are generally used when referring to a method or other Ruby construct. Strings will work too, but Ruby will recognise symbols faster.

#### Changing method arguments

Ruby convention is to not change any arguments unless the method ends in `!`. A useful method to work with arguments but to make sure they aren't changed is `dup`.

	sentence = sentence.dup 
	
So the variable sentence is a reference type (the address of memory in Ruby). `dup` will create a new object on the heap and return the address of this object. The original will not be changed and the original `sentence` will still hold the address of the original object.

Numbers and symbols can't be `dup`ed.

### while and until

It is better to use an iterator instead of `while` and `until`

### self

`self` is a special variable and can be used within a class to represent the object upon which this method is being called.

### collect

`collect` is very similar to `each` in that it returns an iterator. The difference is that `collect` keeps the answer the block gives back and adds it to a new array. 

The following code iterates over an array, operating on each item and returning the results in a corresponding array.

	catsandtips = [0.12, 0.63, 0.09].collect { |catcost| catcost + ( catcost * 0.20 ) }

### Inheritance

This is denoted using a single angle bracket `<`:

	class ToastyBear < Object; end

Here the "inheritance from `Object`" is actually unnecessary since all objects in Ruby will inherit from `Object` by default. Although you can extend the default classes in Ruby directly, inheritance can also be used to extend and existing type and add your own methods. This way the original is not affected.

The method `is_a?` can be used to check the type of an object.

`MyObject.superclass` can be called on any object to determine the inheritance hierarchy. Every object in Ruby derives from the `Object` class.

### Modules

Modules can be used to group code, similar to namespaces. The `extend` keyword is used to pull all methods from a module into a class or object.



