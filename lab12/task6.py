str1 = "listen"
str2 = "silent"

def get_freq(s):
    freq = {}
    for ch in s:
        freq[ch] = freq.get(ch, 0) + 1
    return freq

if get_freq(str1) == get_freq(str2):
    print("Анаграммы")
else:
    print("Не анаграммы")