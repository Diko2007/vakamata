x=10

def modify_global_variable():
    global x
    x = 20  

modify_global_variable()
print(x)  
def local_example():
    y = 5  
    print(y)

local_example()