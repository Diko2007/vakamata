x = int(input("Введите число x: "))


summa = 0
for i in range(1, x + 1):
    summa += i

print("Сумма чисел от 1 до", x, "равна", summa)