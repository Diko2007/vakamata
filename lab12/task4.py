phone_book = {
    "Ali": "123456",
    "Dana": "654321",
    "Arman": "111222",
    "Aruzhan": "333444",
    "Nurlan": "555666"
}

name = input("Введите имя: ")

if name in phone_book:
    print("Номер:", phone_book[name])
else:
    print("Не найдено")
