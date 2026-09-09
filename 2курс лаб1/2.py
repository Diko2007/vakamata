price = float(input("Введите цену товара: "))
quantity = int(input("Введите количество: "))

cost = price * quantity
nds = cost * 0.12
total = cost + nds

print("Стоимость:", cost)
print("НДС 12%:", nds)
print("Итого:", total)
