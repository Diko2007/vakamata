# Ввод массива
arr = list(map(int, input("Введите элементы массива через пробел: ").split()))

# Проверка длины массива
if len(arr) < 2:
    print("Ошибка: длина массива меньше 2.")
else:
    arr.sort()
    second_max = arr[-1]    
    print("Второй по величине элемент:", second_max)
