import check50
import check50_java

@check50.check()
def someclass_compiles():
    check50_java.compile("Test.java")

@check50.check(someclass_compiles)
def someclass_main_exists():
    """Test is application class"""
    check50_java.checks.is_application_class("Test")