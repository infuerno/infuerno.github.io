---
layout: post
title: "Ruby Cheatsheet"
---

## Strings and Regular Expressions

`"string"`, `%Q{string}` use double quotes for interpolation, %Q lets you have double quotes in your interpolated string
`'string'`, `%q{string}` use single quotes for everything else (faster)

`'a@b.com' =~ /(.*)@(.*)\.com$/i` to match a string against a regex

- `i` ignore case
- if no match, value is false
- if match, value is non-false, and $1..$n capture groups
- `%r{(.*)$}i` not seen v often
- `Regex.new('(.*)$', Regexp::IGNORECASE)`

## Objects, methods

`nil.methods` to list methods for an object
`nil.respond_to?(:to_s)` to check if an object will respond to a particular method
`3+4` is shorthand for `3.+(4)`
`3.send(:+, 4)` alternatively uses the `send` method to send an operation and parameters to an object
`arr.[]=(4, "box")` is the same as `arr[4] = "box"`

## Classes and Inheritance

```ruby
class SavingsAccount < Account # inheritance
  # constructor used when SavingsAccount.new(...) called
  def initialize(balance=0) # optional argument
    @balance = balance      # note instance v local variable
  end
  def balance # instance method
    @balance  # instanc var is visible only to this object hence needs a getter
  end
  def balance=(new_amount) # note the method name for a setter
    @balance = new_amount
  end
  def deposit(amount)
    @balance += amount
  end
  @@bank_name = "MyBank.com" # class (static) variable
  # a class method
  def self.bank_name # use self. for a class method
    @@bank_name
  end
  # or
  # def SavingsAccount.bank_name ; @@bank_name ; end
end
```

### Accessors

`attr_accessor`, `attr_reader` and `attr_writer` save having to write explicit getters and setters in the case these methods don't do anything interesting. These are examples of _metaprogramming_ in Ruby in that the keyword constructs are replaced by actual getters and setters at run time.
