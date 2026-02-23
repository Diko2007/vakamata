#А тут мы получаем Сумму каждого столбца и строк отдельно в конце получая информацию о максимальной сумме столбца или строки
from random import randint

print('двумерный массив. A[N][M]. Количество элементов N*M')
n = int(input())

toy = [[0 for i in range(n)] for j in range(n)]

for i in range(n):
    for j in range(n):
        toy[i][j] = randint(2, 5)


for i in range(n):
    for j in range(n):
        print(toy[i][j], end=' ')
    print()

print("\nСуммы строк:")
row_sums = []
for i in range(n):
    s = 0
    for j in range(n):
        s += toy[i][j]
    row_sums.append(s)
    print(f"Строка {i}: {s}")

print("\nСуммы столбцов:")
for j in range(n):
    s = 0
    for i in range(n):
        s += toy[i][j]
    print(f"Столбец {j}: {s}")

max_sum = max(row_sums)
max_index = row_sums.index(max_sum)

print(f"\nСтрока с максимальной суммой: {max_index}")
print(f"Максимальная сумма: {max_sum}")