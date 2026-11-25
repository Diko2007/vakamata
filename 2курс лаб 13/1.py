shopping_list = []

def add_product():
    product = input("Введите название товара: ")
    shopping_list.append(product)
    print("Товар добавлен!")

def remove_product():
    product = input("Какой товар удалить? ")

    if product in shopping_list:
        shopping_list.remove(product)
        print("Товар удалён!")
    else:
        print("Такого товара нет в списке.")

def show_products():
    if not shopping_list:
        print("Список покупок пуст.")
    else:
        print("\nСписок покупок:")
        for product in shopping_list:
            print("-", product)

while True:
    print("\n1. Добавить товар")
    print("2. Удалить товар")
    print("3. Показать список")
    print("0. Выход")

    choice = input("Выберите действие: ")

    if choice == "1":
        add_product()
    elif choice == "2":
        remove_product()
    elif choice == "3":
        show_products()
    elif choice == "0":
        break
    else:
        print("Неверный выбор!")