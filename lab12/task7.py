products = {
    "apple": 100,
    "banana": 80
}

# добавление
products["orange"] = 120

# изменение
products["apple"] = 110

# удаление
del products["banana"]

# поиск
name = "apple"
print(products.get(name, "Нет товара"))