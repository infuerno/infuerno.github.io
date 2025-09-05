---
layout: post
title: "Codecademy: Ruby"
---

## Assignment
The conditional assignment operator  `||=` can be used to assign something only if currently not assigned. It's made up of the OR `||` logical operator and the normal `=` assignment operator.

## Conditions
`unless` - opposite to `if`, tend not to use with else

### Tenary operator

```
today = "Monday"
puts today == "Thursday" ? "time to go home" : "not yet"
```

## Loops
`for` is not used much in Ruby, though `for i in (1..10)` is useful.

Since most iterations involve an array or hash of items, the `each` keyword is much more useful.
When using iterators, the variable name of the iterated item (the **index variable**) is **within** the loop, whether using brackets or `do` and `end`.

`[1,3,5,7,9].each { |odd| puts odd * 2 }`
```
[1,3,5,7,9].each do |odd|
  puts odd * 2
end
```

Other useful looping constructs:
`5.times`, `1.upto(5)`, `5.downto(1)`

`break` and `next` are all useful ad hoc constructs e.g. `next if i % 2 == 0` to skip even numbers
`redo` repeats the current iteration e.g. `redo if i == 2`
`retry`  starts the whole loop from the start e.g. `retry if i == 2`

## Arrays and Hashes
Initialise an array of strings using the `%w` shortcut: `a = %w{ ant bee cat dog elk }`
By default hash lookups return `nil` (which is falsey) when indexed by a key it doesn’t contain. The default can be changed when the hash is created e.g. `Hash.new(0)`. In this way you can combine a look up with e.g. an increment without having to check for existence first.
Hashes are also commonly used as a way to have named parameters in functions.
`<<` is useful instead of `.push` and `+=` with arrays and strings respectively.
`collect`  method to act on every element of an array e.g.  `doubled_fibs = fibs.collect { |i| i*2 }` or use `collect!` to modify in place.
`.select` can select a subset of a hash based on a block.
`.each_key` and `.each_value` can be used to iterate over only keys or values (in this case you ONLY get the keys or the values to play with).

## Symbols
Symbols pop up in a lot of places in Ruby, but they're primarily used either as hash keys or for referencing method names. 
When initialising hashes, a shorthand is possible from:
```
movies = {
    :clockwork_orange => "Alex de Large goes large",
    :withnail_and_i => "Is that soup?",
}
```
to:
```
movies = {
    clockwork_orange: "Alex de Large goes large",
    withnail_and_i: "Is that soup?",
}
```

### Benchmarking symbol lookup time
```
require 'benchmark'

string_AZ = Hash[("a".."z").to_a.zip((1..26).to_a)]
symbol_AZ = Hash[(:a..:z).to_a.zip((1..26).to_a)]

string_time = Benchmark.realtime do
  100_000.times { string_AZ["r"] }
end

symbol_time = Benchmark.realtime do
  100_000.times { symbol_AZ[:r] }
end

puts "String time: #{string_time} seconds."
puts "Symbol time: #{symbol_time} seconds."
```

`.respond_to?` with a method name using a symbol is better than checking if a variable is of a certain type. Ruby is less concerned about what kind of thing an object is and only really cares about what method calls it responds to. e.g. `age.respond_to?(:next)`

## Blocks
Define methods which can accept blocks by using the `yield` keyword in the method.
```
def my_each(arr)
    arr2 = Array.new
    for item in arr
        arr2 << yield(item)
    end
    arr2
end

my_each([1,2,3,4,5]) { |n| n*2 }
```

## Procs
Just as you can save a piece of code as a method and then reuse it, you can do the same thing with blocks so you don’t have to keep defining them whenever you want to use one. To save a block and reference it, use a **proc**.

To create a proc use `Proc.new` e.g. `cube = Proc.new { |x| x ** 3 }`

### Symbols and procs
(TODO understand what this is doing)
```
strings = ["1", "2", "3"]
nums = strings.map(&:to_i)
==> [1,2,3]
```

## Lambdas
A lambda is just like a proc, except it cares about the number of arguments it gets and it returns to its calling method rather than returning immediately.

## Modules
Modules are a way to group related code and classes. Can additionally store classes, methods and constants (doesn’t make sense for variables). Main purpose is to separate in differently named spaces “name spacing”. The `::` scope resolution operator is used to refer to qualify something with its namespace.

* Use `Math::PI` to reference PI in the Math module. 
* `require ‘date’` may be needed if the module is not included by default
* `include Math`  to bring all the Math module’s methods, classes etc into the current namespace, so the namespace doesn’t need prepending. This is called a `mixin`
* Can utilise this to define various methods in a module and then mix them straight into a class instance without redefining them all again.
* Mix modules into the class itself using `extend`.