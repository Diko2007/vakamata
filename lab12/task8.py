numbers = [4, 7, 1, 9, 7, 3, 1]

seen = set()

for num in numbers:
    if num in seen:
        print("Первое повторяющееся:", num)
        break
    seen.add(num)
    