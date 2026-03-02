import time

def recursive_factorial(n):
    if n == 0 or n == 1:
        return 1
    else:
        return n * recursive_factorial(n - 1)

def iterative_factorial(n):
    result = 1
    for i in range(1, n + 1):
        result *= i
    return result

n = 10
print(f"Рекурсивный факториал числа {n}: {recursive_factorial(n)}")
print(f"Итерационный факториал числа {n}: {iterative_factorial(n)}")

n = 11  # Примерно для 1000! будет видно различие

start_time = time.time()
recursive_factorial(n)
print("Рекурсивная версия времени:", time.time() - start_time)

start_time = time.time()
iterative_factorial(n)
print("Итерационная версия времени:", time.time() - start_time)