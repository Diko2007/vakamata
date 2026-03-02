def count_depth(n, depth=0):
    if n == 0:
        return depth
    return count_depth(n - 1, depth + 1)

print(count_depth(5))