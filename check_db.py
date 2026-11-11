import sqlite3

db = sqlite3.connect("data/database/nexus.db")

tables = db.execute(
    "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
).fetchall()

print(tables)

db.close()