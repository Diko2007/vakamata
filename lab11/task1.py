from collections import deque

graph = {
    'A': ['B', 'C'],
    'B': ['D'],
    'C': ['E'],
    'D': [],
    'E': []
}

print("Задача 1: Граф:", graph)

graph['F'] = ['A', 'E']
graph['A'].append('F')

print("\nЗадача 2: Граф после добавления вершины F:", graph)

def get_neighbors(graph, node):
    return graph.get(node, [])

print("\nЗадача 3: Соседи вершины A:", get_neighbors(graph, 'A')) 


def dfs_recursive(graph, node, visited=None):
    if visited is None:
        visited = set()
    visited.add(node)
    print(node, end=' ')
    for neighbor in graph[node]:
        if neighbor not in visited:
            dfs_recursive(graph, neighbor, visited)
    return visited

print("\n\nЗадача 4: DFS (рекурсивно):")
dfs_recursive(graph, 'A')


def dfs_stack(graph, start):
    visited = set()
    stack = [start]

    print("\n\nЗадача 5: DFS (через стек):")
    while stack:
        node = stack.pop()
        if node not in visited:
            print(node, end=' ')
            visited.add(node)
            stack.extend(reversed(graph[node]))
    return visited

dfs_stack(graph, 'A')


def bfs(graph, start):
    visited = set()
    queue = deque([start])

    print("\n\nЗадача 6: BFS:")
    while queue:
        node = queue.popleft()
        if node not in visited:
            print(node, end=' ')
            visited.add(node)
            queue.extend(graph[node])
    return visited

bfs(graph, 'A')


def traverse(graph, start):
    print("\n\nЗадача 7: Обход из вершины", start)
    visited = bfs(graph, start)
    print("\nПорядок обхода:", visited)

# пример вызова
traverse(graph, 'A')


def has_path(graph, start, end):
    visited = set()
    queue = deque([start])

    while queue:
        node = queue.popleft()
        if node == end:
            return True
        if node not in visited:
            visited.add(node)
            queue.extend(graph[node])
    return False

print("\n\nЗадача 8: Есть ли путь A -> E:", has_path(graph, 'A', 'E'))


def reachable_count(graph, start):
    visited = bfs(graph, start)
    return len(visited)

print("\n\nЗадача 9: Количество достижимых вершин из A:", reachable_count(graph, 'A'))


def shortest_path(graph, start, end):
    queue = deque([[start]])
    visited = set()

    while queue:
        path = queue.popleft()
        node = path[-1]

        if node == end:
            return path

        if node not in visited:
            visited.add(node)
            for neighbor in graph[node]:
                new_path = list(path)
                new_path.append(neighbor)
                queue.append(new_path)

    return None

print("\nЗадача 10: Кратчайший путь A -> E:", shortest_path(graph, 'A', 'E'))




# Что такое граф?
# Граф — это структура данных из вершин (узлов) и рёбер (связей между ними)

# чем DFS отличается от BFS?
# Граф — это структура данных из вершин (узлов) и рёбер (связей между ними)

# Почему необходимо хранить visited?
# Чтобы избежать зацикливания и повторного обхода одних и тех же вершин

# Как представляется граф в Python?
# Обычно как словарь списков (список смежности).

# Какой алгоритм используется для поиска кратчайшего пути?
# BFS — для невзвешенных графов.
