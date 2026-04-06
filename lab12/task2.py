numbers = [5, 2, 5, 3, 2, 5]

frequency = {}

for num in numbers:
    frequency[num] = frequency.get(num, 0) + 1

print(frequency)