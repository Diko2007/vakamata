#Здесь мы получаем сумму всех элементов массива


from random import randint
print('двумерный массив. A[N][M]. Количество элементов N*M')
n=int(input())
toy=[[0 for i in range(n)] for j in range(n)]

for i in range(n):
    for j in range(n):
        toy[i][j]=randint(2,5)

for i in range(n):
    for j in range(n):
        print(toy[i][j], end=' ')
    print()
s=0
for i in range(n):
    for j in range(n):
       s+=toy[i][j]
print(s)
