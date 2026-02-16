# Ввод массива (списка) чисел
arr = list(map(int, input("Введите элементы массива через пробел: ").split()))

# 1. Количество положительных чисел
positive_count = sum(1 for x in arr if x > 0)

# 2. Количество отрицательных чисел
negative_count = sum(1 for x in arr if x < 0)

# 3. Количество чётных элементов
even_count = sum(1 for x in arr if x % 2 == 0)

# Вывод результатов
print("Количество положительных чисел:", positive_count)
print("Количество отрицательных чисел:", negative_count)
print("Количество чётных элементов:", even_count)