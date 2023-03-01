import check50
import check50_java

@check50.check()
def exists():
    """Verify that projects file exists"""
    check50.exists("hello.py", "helloadvanced.py")

@check50.check(exists)
def prints_hello():
    """Verify that hello.py displays Hello, World. Depends on exists() function."""
    check50.run("python3 hello.py").stdout("Hello, world!", regex=False).exit(0)

@check50.check(exists)
def prints_hello_advanced():
    """Verify that helloadvanced function returns the good string"""
    name: str = "test"
    check50.run("python -c 'import helloadvanced; print(helloadvanced.sayHello(\"{}\"))'".format(name)).stdout("Hello, " + name, regex=False).exit(0)
