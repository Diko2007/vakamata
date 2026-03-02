def fibonacci_optimized(n, memo={0: 0, 1: 1}):
    if n in memo:
        return memo[n]
    else:
        memo[n] = fibonacci_optimized(n - 1, memo) + fibonacci_optimized(n - 2, memo)
        return memo[n]

print(fibonacci_optimized(10))  