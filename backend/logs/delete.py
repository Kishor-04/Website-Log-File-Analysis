import os

n = 9000000  # Number of lines to delete
base_dir = os.path.dirname(__file__)  # Folder where delete.py is
input_file = os.path.join(base_dir, "access.log")

with open(input_file, "r", encoding="utf-8") as f:
    lines = f.readlines()[n:]

with open(input_file, "w", encoding="utf-8") as f:
    f.writelines(lines)
