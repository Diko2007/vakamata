def max_element(arr, index=0):
    if index == len(arr) - 1:  
        return arr[index]
    else:
        
        max_of_rest = max_element(arr, index + 1)
        return arr[index] if arr[index] > max_of_rest else max_of_rest

arr = [3, 1, 4, 1, 5, 9, 2, 6]
print(max_element(arr))  

def fibonacci_optimized(n, memo={0: 0, 1: 1}):
    if n in memo:
        return memo[n]
    else:
        memo[n] = fibonacci_optimized(n - 1, memo) + fibonacci_optimized(n - 2, memo)
        return memo[n]

print(fibonacci_optimized(10))  