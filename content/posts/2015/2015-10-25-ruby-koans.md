---
layout: post
title: "Ruby Koans"
---
Reference: <http://rubykoans.com/>

## Misc

* `==` returns true if `obj` and `other` are the same. It is typically overridden to provide a more class specific meaning.
* `equal?` shouldn't be overriden and is used to determine object identity.
* `eql?` if two objects refer to the same hash key. Subclasses often alias `eql?` to their overriden `==` method. `Numeric` types are an exception
* `respond_to?(method_name)` can be called on any object to see if `obj` _responds_ to a given method, by default only includes public methods. Returns false if not implemented, returns `respond_to_missing?` if not defined.
* `select` takes a block and returns an array or an enumerator e.g. `["cat", "bat", "rat", "zat"].select { |w| w[/[cbr]at/ }` returns `["cat", "bat", "rat"]`
* EVERY statement in ruby returns a value (hence implicit return values from methods)

## Assert

* `assert` will assert the following statement is true e.g. `assert true`, `assert 2 + 2 == 4`
* `assert_equal [expected], [actual]` will assert the supplied parameters are equal, displaying an intelligent message if fails

## Nil

Reference: <http://lukaszwrobel.pl/blog/ruby-is-nil>

`nil` is an object, it is a singleton of the class `NilClass`

>Theoretically, nil values should be incomparable, just like it is in SQL. But for practical reasons and to spare memory, nil object was made a singleton. That is, there is always exactly one instance of the NilClass which can be simply referred to by typing `nil`.

`is_a?(class)` is an instance method which returns true if `class` is the class of `obj` or a superclass of `obj`

A `begin` / `rescue` / `end` code block will catch an exception and allow you to deal with it

    begin
      nil.some_method_nil_doesnt_know_about
    rescue Exception => ex
      assert_equal NoMethodError, ex.class
      assert_match(/undefined method/, ex.message)
    end

* `nil.nil?` only returns true when called on the object `nil`
* `nil.to_s` returns empty string, other methods such as `to_a` etc return empty objects or 0 etc
* `nil.inspect` returns `"nil"`

To test if an object is nil call `nil?` e.g. `if myobject.nil? ...`

TODO: why is it better to do this than test for `myobject == nil` ?

## Objects

* Everything is an `Object`
* All objects can be converted to strings (where 123 becomes "123", nil becomes "" etc)
* `inspect` can be called on any object and depending on the class will often override the default behaviour to return e.g. a string representation of an object (`to_s` is often aliased)
* Every object has an id - returned by calling the method `object_id`. `true`, `false`, `nil` and all `Fixnum`s have constant object ids

## Arrays

* Define a new array using `Array.new`
* Push a new item onto the end of an array using `<<` e.g. `array << 333`
* `[]` is the Array retrieval operator
* `array[index]` retrieves a single element, going forwards from 0 and backwards from -1 e.g. array[3]
* Returns `nil` if the index is out of range
* `array[range]` retrieves every element identified by an index in the given range e.g. array[1..3]
* `array[0...3]` would not include the element at index 3
* `array[2..-1]` would try to retrieve a sub array which makes sense e.g. from the second element to the end
* `array[start_index, length]` retrieves a sub array
    * Returns an empty array when the starting index is at the end of an array
    * Returns `nil` when the starting index is out of range
* `at` can be used to index into an array (slightly faster)
* `slice` can be used alternatively for `[]`
* `slice!` will remove the sliced items from the original array
* Use `push` and `pop` to append and remove items from the end
* Use `unshift` and `shift` to append and remove items from the beginning

## Arrays and assignment

* Assign multiple values at once e.g. `x, y = [1, 2]`
* The splat operator will gather up any unused elements e.g. `x, *y = [1, 2, 3, 4]` will assign 1 to x and [2, 3, 4] to y
* Swapping becomes `x, y = y, x`

## Hashes

* Define a new hash using `Hash.new` or using a literal e.g. hash = { :one => 1, :two => 2 }
* `hash[:one]` retrieves value for a given key, or `nil` if the key doen't exist
* Alternatively use `hash.fetch(:one)` (throws `KeyError` if the key doesn't exist)
* `hash1 == hash2` is true if the two hashes contain the same key / value pairs
* `hash.keys` returns an array of the keys, `hash.values` returns an array of the values
* Merge two hashes using `hash1.merge(hash2)`. Any keys in both will be replaces by the values in `hash2`
* Hashes have a default value that is returned when accessing keys that do not exist in the hash. This can be passed into `new` e.g. `Hash.new(0)`. If no default is set, `nil` is used.

## Strings

* Use either single or double quotes
* Only double quotes intepret escape characters e.g. "\n"
* Only double quotes interpolate variables e.g. #{value} in the middle of a string will be replaced
* When needing a mixture of double and single quotes in the same string
  * Use backslashes  e.g. ` "He said, \"Don't\""`
  * Or use flexible quoting e.g. `%(He said, "Don't")`, %!He said, "Don't"!`, %{He said, "Don't"}`
  * Flexible quotes can handle multiple lines
  * `<<EOS` and `EOS` can also be used to demarquate the start and finish of a string
* `+` is used to concatenate two strings
  * `+=` will leave any original strings unmodified not involved in the operation
* `<<` can also be used to append to strings, but will also modify any original strings not involved in the operation 
* Use `[]` to retrieve sub strings in the same way as for arrays
* Single characters can be written using a question mark e.g. `?a`. In older versions of ruby they are represented by numbers and are the same as the ASCII equivalent. In newer version, they are represented by strings.
* Split strings using `split`. Pass in a regex pattern for the pattern to split on e.g. `string.split(/:/)`
* Join arrays of words using `join`

TODO - why do Ruby programmers favour << when building up strings?

## Symbols

* Symbols which are identical have the same object id
* `Symbol.all_symbols` returns an array of all known symbols
* Symbols with spaces can be defined: `:"cats and dogs"`
* Symbols using interpolation can be defined: `:"cats #{value} dogs"`
* Symbols can also be interpolated in a string (to_s is implicitly called)

TODO: Why is it not a good idea to dynamically create a lot of symbols?

## Regular expressions

* Regular expressions are defined using forward slashes e.g. `/pattern/`
* Regexps can be passed into the `[]` method on a string e.g. "my string"[/str/]. Will return the matching string or `nil`
* As with all regular expressions the repetition operators: `*` (zero or more), `+` (one or more), `?` (optional) are greedy
* Left most charater wins e.g. `"abbccc az"[/az*/]` returns `"a"`
* `/\d+/` matches digits
* `/\s+/` matches whitespace
* `/\w+/` matches a single word (can include numbers and underscores)
* `.` matches any non newline character
* `^` negates patterns e.g. `/[^t]/` matches anything but not `t` 
* Capitalised versions of `\d`, `\s` and `\w` mean NOT i.e. `\D`, `\S` and `\W`
* `\A` anchors to the start of a string e.g. `/\Astart/`
* `\z` anchors to the end of a string e.g. `/end\z/`
* `^` anchors to the start of a line
* `$` anchors to the end of a line
* `\b` anchors to a word boundary
* Parentheses group content for repetition operators and also index multiple matches so they can be referenced individually e.g. `"Gray, James"[/(\w+), (\w+)/, 1]` returns `"Gray`
* Variables can also be used to access captures e.g. `$1` access `"Gray"` above
* `scan` finds all matches and returns an array e.g. `"one two-three".scan(/\w+/)` returns `["one", "two", "three"]`
* `sub` finds the first match and replaces it
* `gsub` replaces all matches

TODO: When would * fail to match?

## Methods

* Methods can be called with or without parentheses (HOWEVER missing parentheses can be ambiguous)
* Passing the wrong number of arguments will cause an `ArgumentError`
* Parameters can be assigned default values in the method definition e.g. `def method_with_defaults(a, b=:default_value)`
* Pass a variable number of arguments using the splat operator e.g. `def method_with_var_args(*args)`. Here `args` will be of type `Array`.
* TODO check about implicit return values
* Return an explicit value using `return` e.g. `return :value`
* Append `self.` to methods in the same class (optional)
* `self.` cannot be used with private methods
* Arguments can be labelled with a keyword and then MUST have a default specified. Specify any values to be overriden using the keyword.

## Constants

* Constants outside a class must be referenced using double colons e.g. `::MyConstant`
* Constants inside another class must be qualified with the class name e.g. `MyClass::MyConstant`
* Nested classes inherit constants from enclosing classes
* Sub classes inherit constants from parent classes
* If both nested *and* sub classed, NESTED wins

## Control statements

* `if` statements return values e.g. `result = "x is 5" if x == 5`
* `unless` is the opposite to `if` e.g. `result = "x not 5" unless x == 5`
* `break` can be used to break a loop e.g. `break if i % 2 == 0`
* `break` can return values e.g. `break i if i % 2 == 0`
* `next` can be used in a simlar way to continue to next iteration in a loop
* 



