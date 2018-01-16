---
layout: post
---
##Chapter 1 Cocoa: What is it?

Objective C reference on Apple site: <http://developer.apple.com/library/mac/#d
ocumentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/Introduction/Introduct
ion.html#//apple_ref/doc/uid/TP40011210>

##Chapter 2 Let's Get Started

  * **Outlet** - instance variable which is a pointer to another object  
  * **Action** - method that can be triggered by user interface objects  
  * **Set the outlet of an object** - control drag from the object that needs to know to the object it needs to know about
  * Navigate -> Jump to Next Counterpart command, Control-Command-UpArrow, flips the editor between corresponding `.h` and `.m` files.   

##Chapter 3 Objective-C
###Allocating memory
Create a new instance of `NSMutableArray` by sending the message
`alloc` to the `NSMutableArray` class:
```
[NSMutableArray alloc];
```
###Sending messages
Send the message init to the object foo points to, "foo is the receiver of the
message init":

	[foo init];

Messages can be nested. The method init returns the newly initialised object, so message sends must always be initialised like this:

	foo = [[NSMutableArray alloc] init];

To differentiate between constant C strings and constant `NSString`s, you
must put `@` before the opening quote of a constant `NSString`:

	NSLog(@"The number at index %d is %@", i, numberToPrint);

Arguments are specified using a colon:

	[foo addObject:bar];

Multiple arguments use different parts of the selector (or method name). In this case the selector is insertObject:atIndex:

	[foo insertObject:bar atIndex:5];

###NSArray
List of pointers to other objects, indexed by integers, cannot contain nil, is immutable (NSString and NSNumber are also immutable.) One array can hold objects of different classes. It can't hold C primitive types e.g. int, float.

###Initialisers
* You do not have to create any initializer in your class if the superclass’s initializers are sufficient
* If you decide to create an initializer, you must override the superclass’s designated initializer.
* If you create multiple initializers, only one does the work—the designated initializer. All other initializers call the designated initializer.
* The designated initializer of your class will call its superclass’s designated initialiser.

If a class initialiser always requires an argument, override the base class init method to throw an exception.

	- (id)init
	{
	    @throw [NSException exceptionWithName:@"BNRBadInitCall"
	                 reason:@"Initialize Lawsuit with initWithDefendant:"
	               userInfo:nil];
	    return nil;
	}

###The debugger
A handy feature is the "print object" `po`. Calling `po` on an object will send the message `description` to the object.

	po newEntry

The debugger can be configured to stop whenever an exception is thrown by "adding an exception breakpoint" from the breakpoint navigator.

Use `NSAssert()` to throw an exception as soon as the program is in an unstable state e.g. a variable is unexpectedly nil. Note: this only works in Objective-C methods. Use `NSCAssert()` in C methods.

Set the preprocessor macro for release mode `NS_BLOCK_ASSERTIONS` to ensure an exception is not thrown in release mode.

###Static Analyzer
The static analyzer (Product > Analyze) shows potential problems with the code over and above compiler warnings and errors.

##Chapter 4 Memory Management
When an object is no longer used i.e. no longer has any pointers to it, the memory can be reused. Working out which memory is available for reuse is tricky.

Three solutions (with advantages and disadvantages) are:

1. Manual reference counting or retain counts. Every object has a retain count which is the number of objects with pointers to it. When the retain count of an object is 0 it is deallocated. 
    * Requires explicit programming statements. 
    * Retain cycles possible (two objects reference each other but not referenced by anything else).
2. Garbage collection. Unreachable objects are automatically deallocated. 
    * Performance cost - poorer or uneven performance while the GC scans the object collection
    * Cannot manage manually allocated memory e.g. allocated with `malloc`
    * GC not supported on Mac OS X < 10.5 or iOS
3. ARC - automatic reference counting. Retain count mechanism is used, but is managed by the compiler rather than explicitly by programmers.
    * Doesn't require explicit programming statements to manage retain counts
    * Doesn't have GC performance hit
    * Still needs work to avoid retain cycles
    * Doesn't manage manually allocated memory

###Manual reference counting
When an object is created using alloc, the retain count is 1. Retain count is incremented by sending the `retain` message and deallocated by sending the `release` message.

	NSDate *now = [[NSDate alloc] init];

	/* lines of code which use the variable now */

	[now release]

When creating objects and adding them to an array, the array stores a pointer to the object and sends it a message `retain`. The retain count is incremented. When the array is deallocated it sends `release` messages to the objects it contains. The object's retain counts are decremented, but will still be 1. Therefore the objects should be sent a `release` message after adding to the array.

	Cat \*cat = [[Cat alloc] initWithBreed:breed];
	[array addObject:cat];
	[cat release];

The `array` now has ownership of `cat`.

Objects will often `retain` objects they hold references to. If an object is passed into a constructor the `retain` message will be sent to it and similarly a `release` message sent in the destructor `dealloc`.

If overriding the `dealloc` method, call `[super dealloc]` at the *end*.

###Autoreleasing objects
When a method creates and object and returns a pointer to that object we don't want to `retain` the object. But if we `release` it before returning, there will be no object to return. To resolve this use the autorelease pool by sending the object the `autorelease` message. The release message is sent to all objects in the autorelease pool when the pool is drained. In Cocoa an autorelease pool is created before an event and drained after the event has been handled. Autorelease pools can also be created explicitly in non-event driven applications, or to more explicitly manage memory.

Many methods return autoreleased objects. e.g. `NSString initWithFormat` doesn't, but the class method `NSString stringWithFormat` does.

From stackoverflow <http://stackoverflow.com/questions/1378206/do-all-class-methods-return-an-autoreleased-object>:

>Class methods, just like instance methods, should adhere to the standard Cocoa memory management rules.

>>You take ownership of an object if you create it using a method whose name begins with “alloc” or “new” or contains “copy” (for example, alloc, newObject, or mutableCopy), or if you send it a retain message. You are responsible for relinquishing ownership of objects you own using release or autorelease. Any other time you receive an object, you must not release it.

>Presumably they are returning an autoreleased object, or a reference to a singleton or something like that. Either way, you need not release the object unless it started with "alloc" or "new" or contained "copy". You need not retain it unless you're looking to keep it around past the scope of the current autorelease pool, by storing it in an iVar or something like that.

###The retain count rules
* If you create an object by using a method whose name starts with `alloc` or `new` or contains `copy`, you have taken ownership of it.
* An object created through any other means, such as a convenience method, is not owned by you. 
* If you don’t own an object and want to ensure its continued existence, take ownership by sending it the message `retain`.
* When you own an object and no longer need it, send it the message `release` or `autorelease`.
* As long as it has at least one owner, an object will continue to exist.

Finally, think locally and trust that all other code is doing the right thing

###Strong and weak references
By default all references are strong. ARC will take care of releasing strong references. 

Retain cycles need to be managed properly by strategically using weak references. A typical example is where a class holds references to both parents and children. The pattern commonly used in Objective-C is to leave the parent-child relationship strong, but make the child-parent relationship weak:

	@interface Person : NSObject {
	    __weak Person *parent; // Good! No strong reference cycle.
	    NSMutableArray *children;
	}
	@end

###ARC
Under ARC it is an error to use the manual retain count functionality. That is, you can't send the messages `retain`, `release`, `autorelease`, `dealloc`.

###Chapter 5 Target/Action

###Chapter 6 Helper Objects
Functionality of objects in the Cocoa framework are often extended using helper objects. For example a table view is supplied with a helper object to supply the data.

####Delegates
Many classes in the Cocoa framework have an instance variable called `delegate` to point to a helper object. If your class is to be the delegate, then change the class declaration to refer to this protocol:

	@interface SpeakLineAppDelegate : NSObject    <NSApplicationDelegate, NSSpeechSynthesizerDelegate> {

Additionally set the delegate outlet  of the speech synthesizer with `[_speechSynth setDelegate:self]` in `init`.

####NSTableView and its dataSource
`NSTableView` has a helper object called `dataSource`. The NSTableView dataSource object needs to conform to the NSTableDataSource informal protocol i.e. has to have some methods to give data. `NSTableView` also has a helper object called `delegate`.

####Finding delegate methods at runtime
If you wanted to see the checks for the existence of the delegate methods, you could override respondsToSelector: in your delegate object:

	- (BOOL)respondsToSelector:(SEL)aSelector{
		NSString *methodName = NSStringFromSelector(aSelector);
		NSLog(@"respondsToSelector:%@", methodName);
		return [super respondsToSelector:aSelector];
	}

###Chapter 7 Key-Value Coding and Key-Value Observing
Key-value coding (or KVC) is a mechanism that allows you to set and get the value of any variable by its name. Alternatively you can declare getter and setter methods. These will use the KVC methods as long as the naming convention for getters and setters is followed.

####Bindings
Graphical objects can be bound to keys - the view will automatically keep the values in sync.

If the value of the object is changed directly, any observers are not notified of the change. Explicityly trigger the notification of the observers with:

	[self willChangeValueForKey:@"fido"];
	// action
	[self didChangeValueForKey:@"fido"];

####Properties
If simple setters and getters are required, properties can be declared instead:

* `@property (readwrite, assign) int fido;` in the header file;
* `@synthesize fido` in the implementation file

####Attributes of a property
* `readwrite` or `readonly`
* `assign`, `strong`, `weak` or `copy` where `assign` is used for non-pointer types
* `nonatomic` can be used to explicitly eliminate the overhead of using locks to ensure atomic setters

####Key paths

	NSString *mn;
	mn = [selectedPerson valueForKeyPath:@"spouse.scooter.modelName"];

	NSNumber *theAverage;
	theAverage = [employees valueForKeyPath:@"@avg.expectedRaise"];

Other commonly used operators:

* \@avg
* \@count
* \@max
* \@min
* \@sum

###Chapter 8 NSArray Controller
Controller classes in the MVC design pattern are usually application specific and used with more general-purpose Views and Models.
`NSController` is an abstract class, with `NSObjectController`displaying the content of an object. `NSArrayController` further derives from this to display the contents of an array.
Model classes need only import `Foundation/Foundation.h`


###Chapter 9

###Chapter 10

###Chapter 11

###Chapter 12

###Chapter 13

###Chapter 14

###Chapter 15

###Chapter 16

###Chapter 17

###Chapter 18

###Chapter 19

###Chapter 20

###Chapter 21

###Chapter 22

###Chapter 23

###Chapter 24

###Chapter 25

###Chapter 26

###Chapter 27

###Chapter 28

###Chapter 29

###Chapter 30

###Chapter 31

###Chapter 32

###Chapter 33

###Chapter 34

###Chapter 35

###Chapter 36

###Chapter 37

###Chapter 38 The End

  

  