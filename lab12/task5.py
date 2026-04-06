words = ["cat", "dog", "cat", "bird", "dog", "dog"]

count = {}

for word in words:
    count[word] = count.get(word, 0) + 1

for word, c in count.items():
    if c > 1:
        print(word)
