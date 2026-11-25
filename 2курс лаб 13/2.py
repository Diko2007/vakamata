grades = []

def add_grade():
    grade = int(input("Введите оценку: "))

    if 0 <= grade <= 100:
        grades.append(grade)
        print("Оценка добавлена!")
    else:
        print("Оценка должна быть от 0 до 100.")

def show_statistics():
    if not grades:
        print("Список оценок пуст.")
        return

    print("Все оценки:", grades)
    print("Средняя оценка:", sum(grades) / len(grades))
    print("Минимальная оценка:", min(grades))
    print("Максимальная оценка:", max(grades))

while True:
    print("\n1. Добавить оценку")
    print("2. Показать статистику")
    print("0. Выход")

    choice = input("Выберите действие: ")

    if choice == "1":
        add_grade()
    elif choice == "2":
        show_statistics()
    elif choice == "0":
        break
    else:
        print("Неверный выбор!")
        