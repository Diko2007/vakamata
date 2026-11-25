history = []

def add_action():
    action = input("Введите действие: ")
    history.append(action)
    print("Действие добавлено!")

def undo_action():
    if history:
        action = history.pop()
        print("Отменено действие:", action)
    else:
        print("История пуста!")

def show_history():
    if history:
        print("История действий:")
        for action in reversed(history):
            print("-", action)
    else:
        print("История пуста!")

while True:
    print("\n1. Добавить действие")
    print("2. Отменить последнее действие")
    print("3. Показать историю")
    print("0. Выход")

    choice = input("Выберите действие: ")

    if choice == "1":
        add_action()
    elif choice == "2":
        undo_action()
    elif choice == "3":
        show_history()
    elif choice == "0":
        break
    else:
        print("Неверный выбор!")