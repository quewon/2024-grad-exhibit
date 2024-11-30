import os

printer = "Canon_MG3000_series"
filepath = "/media/printme.pdf"
size = "4x6"

os.system("lpr -P " + printer + " -o print-quality=5 -o scaling=70 -o media=" + size + " " + os.getcwd() + "/media/qr.jpg")
os.system("lpr -P " + printer + " -o print-quality=5 -o media=" + size + " " + os.getcwd() + "/media/photo")