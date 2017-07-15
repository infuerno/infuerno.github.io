---
layout: post
title: "Ruby Off Rails"
---

## Recipe Hash

    Recipe = Struct.new(:ingredients, :method)
    recipe = Recipe.new()

## Blocks: Review

Good to structure classes with the class methods first, instance methods, most important first and then any private methods.

    class Panda
        # class methods
        def self.sleep?
        end
        # instance methods
        def eat(food)
        end
        # private methods
        private
        def your_eyes_only
        end
    end

Can only inherit from one other class, but can include modules using include.

    class Panda < Animal
    end

    class Panda < ActiveRecord::Base
        include Animal
    end

Single quoted strings are faster than double quoted strings - the Ruby interpreter doesn't have to check the single quoted strings for any interpolation. Symbols are EVEN faster. Use where possible if something isn't going to change - often something in the domain of the application.






