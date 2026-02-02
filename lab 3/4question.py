age = int(input("Введите ваш возраст:"))
rvota = input("Имеется ли билет:")

if age >= 18 or rvota == 'да':
    print("can")
else:
    print("cant")
