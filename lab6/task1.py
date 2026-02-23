from random import randint
print('двумерный массив. A[N][M]. Количество элементов N*M')
n=int(input())
toy=[[0 for i in range(n)] for j in range(n)]

for i in range(n):
    for j in range(n):
        toy[i][j]=randint(2,5)

    print()
for i in range(n):
    for j in range(n):
        print(toy[i][j], end=' ')
    print()
print('новый массив')

for i in range(n):
    for j in range(n):
        if i==j:
           toy[i][j]=5
for i in range(n):
    for j in range(n):
        print(toy[i][j], end=' ')
    print()
