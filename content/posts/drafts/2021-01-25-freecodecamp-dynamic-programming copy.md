---
layout: post
title: "FreeCodeCamp Dynamic Programming"
---

## References

- By Alvin Zablan from Coderbyte: https://www.youtube.com/watch?v=oBt53YbR9Kk

## Course Contents

⌨️ (00:00:00) course introduction
⌨️ (00:03:30) fib memoization
⌨️ (00:38:39) gridTraveler memoization
⌨️ (01:04:52) memoization recipe
⌨️ (01:09:56) canSum memoization
⌨️ (01:29:29) howSum memoization
⌨️ (01:52:06) bestSum memoization
⌨️ (02:12:45) canConstruct memoization
⌨️ (02:38:36) countConstruct memoization
⌨️ (02:47:30) allConstruct memoization
⌨️ (03:10:53) fib tabulation
⌨️ (03:22:17) gridTraveler tabulation
⌨️ (03:34:32) tabulation recipe
⌨️ (03:37:59) canSum tabulation
⌨️ (03:53:01) howSum tabulation
⌨️ (04:07:21) bestSum tabulation
⌨️ (04:20:50) canConstruct tabulation
⌨️ (04:38:06) countConstruct tabulation
⌨️ (04:50:23) allConstruct tabulation
⌨️ (05:07:44) closing thoughts

## Examples of Dynamic Programming Problems

- Calculate the 40th Fibonnaci number
- Count the number of different ways to move through a 6x9 grid
- Given a set of coins how can I make 27 cents in the least number of coins
- Given a set of substrings what are the possible ways to make the string 'potentpot'

## Part 1. Memoization

### Time and space complexity

#### Example 1

```javascript
const foo = (n) => {
  if (n <= 1) return n;
  return foo(n);
};
```

Function `foo` will be called exactly n times. The time complexity is therefore O(n).

Similarily, for space complexity, n different function calls will be added to the stack until the base case is hit, so the space complexity is also O(n).

#### Example 2

```javascript
const dib = (n) => {
  if (n <= 1) return;
  dib(n - 1);
  dib(n - 1);
};
```

Height of the tree or the number of levels is n. At each level the number of nodes in the tree doubles. Number of recursive calls will multiply by 2 each time i.e. 2 x 2 x 2 ... x 2 - n times i.e. 2^n. Therefore the time complexity is O(2^n).

![Dib Function](https://www.dropbox.com/s/2ntw1z15kz7lkfu/dynamic-programming-dib-function.png?raw=1)

Space complexity is O(n) since the recursive function calls will only ever traverse down one branch at a time, so the maximum depth of the stack at any given time is n.

### Example 3

```javascript
const fib = (n) => {
  if (n <= 2) return 1;
  return fib(n - 1) + fib(n - 2);
};
```

Without memoization, a regular recursive fib function, as coded above, will quickly reach an unmanageable number of steps to get a result.

![Fib function](https://www.dropbox.com/s/6k2ptx9lfwxnsvr/Screenshot%202021-01-25%20at%2022.33.08.png?raw=1)

Dynamic Programming = overlapping sub problems

![](https://www.dropbox.com/s/hkplzr9u6p5g37d/Screenshot%202021-01-25%20at%2022.39.19.png?raw=1)

There is no need to recalculate `fib(5)`. Having calculated the first time, store the result.

### Example 4

```javascript
const fib = (n, memo = {}) => {
  if (n <= 2) return 1;
  memo[n] = memo[n] || fib(n - 1, memo) + fib(n - 2, memo);
  return memo[n];
};
```

![Fib Memoized](https://www.dropbox.com/s/smkbzea840w8pez/Screenshot%202021-01-25%20at%2022.48.59.png?raw=1)

For the nodes marked in lighter green, 2, 3 and 4 - the result was retrieved from the memo instead of having to calculate it again. The time complexity is O(2n) or O(n) and the space complexity is still O(n).
