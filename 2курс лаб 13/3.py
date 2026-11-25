books = []

def add_book():
    name = input("Введите название книги: ")
    books.append(name)
    print("Книга добавлена!")

def search_book():
    search = input("Введите название или часть названия: ").lower()

    found = [book for book in books if search in book.lower()]

    if found:
        print("Найденные книги:")
        for book in found:
            print("-", book)
    else:
        print("Книги не найдены.")

def delete_book():
    name = input("Введите название книги для удаления: ")

    if name in books:
        books.remove(name)
        print("Книга удалена!")
    else:
        print("Такой книги нет.")

def show_books():
    if books:
        print("Каталог книг:")
        for book in books:
            print("-", book)
    else:
        print("Каталог пуст.")

while True:
    print("\n1. Добавить книгу")
    print("2. Найти книгу")
    print("3. Удалить книгу")
    print("4. Показать каталог")
    print("0. Выход")

    choice = input("Выберите действие: ")

    if choice == "1":
        add_book()
    elif choice == "2":
        search_book()
    elif choice == "3":
        delete_book()
    elif choice == "4":
        show_books()
    elif choice == "0":
        break
    else:
        print("Неверный выбор!")