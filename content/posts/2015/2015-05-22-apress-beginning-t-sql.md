---
layout: post
title: "Apress Beginning T-SQL 2012"
---
## Chapter 1 Getting Started

F7 to open the Object Browser in the right hand side of SSMS

### Indexes

:Clustered Index
Only 1 per table, the table is literally ordered using the index, using pages. New items are added to the correct 'page'. Analogous to a phonebook being order by surname, forename.

:Non-clustered Index
Up to 999 per table. An index maintained seperately to the table which has pointers to data in the table. Every time a new entry is added, any non-clustered indexes potentially need to be updated.

### Schemas

Schemas are used to organise tables and objects within the database. Each user has a default schema and can refer to objects within this schema without qualification. Users can also own schemas (but not individual objects). References to objects in schemas other than the user's default must be qualified with the schema name.

## Chapter 2 Writing Simple SELECT Queries

### Selecting

* Using SELECT * is less performant since:
    * it may fetch more rows than you really need
    * it ignores indexes

### Filtering

* The `WHERE` clause contains _predicates_ evaluating to TRUE, FALSE or UNKNOWN
* Use `BETWEEN` to specify an _inclusive_ range of values
* Correspondingly `NOT BETWEEN` yields an _exclusive_ range of values 
* Data stored in date time fields can be searched by any recognisable date time format - the data is held as an int in the database. Careful of filtering on DateTime fields
* Use `LIKE` with `%` to specify multiple chars, `_` to specify a single character
* Using `LIKE` with `[]` to specify a range of letters 
    e.g. `Name LIKE 'H[a,e]rry'` to match Harry OR Herry
    e.g. `Name LIKE 'H[a-e]rry'` to match Harry, Hbrry, Hcrry, Hdrry OR Herry
    e.g. `Name LIKE 'H[^a]rry'` to match anything except Harry
* 

