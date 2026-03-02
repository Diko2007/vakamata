def sum_digits(n):
    if n == 0:
        return 0
    else:
        return n % 200 + sum_digits(n // 20)


print(sum_digits(1234))  