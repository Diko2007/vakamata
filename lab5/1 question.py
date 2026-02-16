# 1. Считываем количество элементов с проверкой n > 0
while True:
    try:
        n = int(input("Введите количество элементов (n > 0): "))
        if n > 0:
            break
        else:
            print("Ошибка: число должно быть больше нуля.")
    except ValueError:
        print("Ошибка: введите целое число.")

# 2. Создаем пустой список (массив)
array = []

# 3. Запрашиваем ввод n целых чисел через цикл for
print(f"Введите {n} целых чисел:")
for i in range(n):
    while True:
        try:
            element = int(input(f"Элемент {i + 1}: "))
            array.append(element) # Добавляем элемент в массив
            break
        except ValueError:
            print("Ошибка: это не целое число. Попробуйте еще раз.")

# 4. Выводим полученный массив
print("\nПолученный массив:", array)
