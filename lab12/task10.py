size = 5
hash_table = [[] for _ in range(size)]

def hash_function(key):
    return key % size

def insert(key):
    index = hash_function(key)
    hash_table[index].append(key)

numbers = [10, 15, 20, 25, 30, 7]

for num in numbers:
    insert(num)

print("Хеш-таблица:")
for i, bucket in enumerate(hash_table):
    print(i, ":", bucket)