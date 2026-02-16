# Ввод массива (списка) чисел
arr = list(map(float, input("Вписывайте два числа-через пробел;").split()))

#1 Сумма чисел
total = sum(arr)

#2 большее число
maximum = max(arr)

#3 меньшее число
minimum = min(arr)

#4 среднее арифметичекое
average = total / len(arr)

# Вывод результатов
print("Сумма элементов:", total)
print("Максимальный элемент:", maximum)
print("Минимальный элемент:", minimum)
print("Среднее арифметическое:", average)
