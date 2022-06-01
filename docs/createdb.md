# Initailizing the Database

Download postgreSQL from https://www.postgresql.org/download/

The project uses version 14.3 for Windows x86-64.

For Windows:

Open Window PowerShell, run

 ```$ psql``` 
 
 to check if your installation is added to PATH, if not, add to path 
 
 ```C:\Program Files\PostgreSQL\14\bin``` or ```path to PostgreSQL\version\bin``` 
 
 and restart PowerShell.

Now, run

```$ pg_ctl -D "C:\Program Files\PostgreSQL\14\data" start```

to start your server.

Then, run
```$ psql -U postgres```
and enter your password as prompted.

To create a database mydb, run

```postgres=# CREATE DATABASE mydb;```

which should output ```CREATE DATABASE```

Run ```postgres=# \l``` to check if you successfully created the database.

Now, exit psql by running 

```postgres=# \q```

Then, run 

```psql -U postgres -d mydb -f path_to/repo/docs/create_db.sql```