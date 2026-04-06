text = "python is great and python is easy"

words = text.lower().split()
freq = {}

for word in words:
    freq[word] = freq.get(word, 0) + 1

max_word = max(freq, key=freq.get)
print("Самое частое слово:", max_word)