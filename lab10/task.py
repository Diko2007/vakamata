# ===== Лабораторная работа: Деревья =====

# Задача 1: класс узла
class Node:
    def __init__(self, data):
        self.data = data
        self.left = None
        self.right = None


# Доп. задание: вставка в бинарное дерево поиска
def insert(root, value):
    if root is None:
        return Node(value)
    if value < root.data:
        root.left = insert(root.left, value)
    else:
        root.right = insert(root.right, value)
    return root


# Задача 3: preorder (прямой обход)
def preorder(node):
    if node:
        print(node.data, end=" ")
        preorder(node.left)
        preorder(node.right)


# Задача 4: inorder (симметричный обход)
def inorder(node):
    if node:
        inorder(node.left)
        print(node.data, end=" ")
        inorder(node.right)


# Задача 5: postorder (обратный обход)
def postorder(node):
    if node:
        postorder(node.left)
        postorder(node.right)
        print(node.data, end=" ")


# Задача 6: количество узлов
def count_nodes(node):
    if node is None:
        return 0
    return 1 + count_nodes(node.left) + count_nodes(node.right)


# Задача 7: высота дерева
def tree_height(node):
    if node is None:
        return 0
    return 1 + max(tree_height(node.left), tree_height(node.right))


# Задача 8: количество листьев
def count_leaves(node):
    if node is None:
        return 0
    if node.left is None and node.right is None:
        return 1
    return count_leaves(node.left) + count_leaves(node.right)


# Задача 9: поиск элемента
def search(node, value):
    if node is None:
        return False
    if node.data == value:
        return True
    if value < node.data:
        return search(node.left, value)
    else:
        return search(node.right, value)


# ===== Задача 2: создание дерева =====
values = [20, 10, 30, 5, 15, 25, 35]

root = None
for v in values:
    root = insert(root, v)

# Вывод корня и детей
print("Корень:", root.data)
print("Левый потомок:", root.left.data)
print("Правый потомок:", root.right.data)

# ===== Задача 10: все операции =====
print("\nPreorder обход:")
preorder(root)

print("\nInorder обход:")
inorder(root)

print("\nPostorder обход:")
postorder(root)

print("\n\nКоличество узлов:", count_nodes(root))
print("Количество листьев:", count_leaves(root))
print("Высота дерева:", tree_height(root))

# Проверка поиска
value_to_find = 15
print(f"\nПоиск {value_to_find}:", search(root, value_to_find))

value_to_find = 100
print(f"Поиск {value_to_find}:", search(root, value_to_find))