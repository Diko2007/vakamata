n = 4
a = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 16]
]

print("Исходный массив:")
for row in a:
    print(row)

row_index = 2      
k = 2              
direction = "right"  


if direction == "right":
    a[row_index] = a[row_index][-k:] + a[row_index][:-k]
else:
    a[row_index] = a[row_index][k:] + a[row_index][:k]

print("\nПосле сдвига:")
for row in a:
    print(row)
