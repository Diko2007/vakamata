text = "algorithm"

chars = {}

for ch in text:
    chars[ch] = chars.get(ch, 0) + 1

print(chars)