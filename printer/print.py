import os

printer = "Canon_MG3000_series"
filepath = "/media/printme.pdf"
size = "4x6"

os.system("lpr -P " + printer + " -o sides=two-sided-long-edge -o print-quality=5 -o media=" + size + " " + os.getcwd() + filepath)