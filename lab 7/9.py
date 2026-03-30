def fast_power(a, n):
    if n == 0:
        return 1
    elif n % 2 == 0:
        half = fast_power(a, n // 2)
        return half * half
    else:
        return a * fast_power(a, n - 1)

print(fast_power(2, 10))  