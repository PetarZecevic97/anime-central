Hello there.
It seems you would like to have anime central database on your MySQL server. I will show you how to do it!
Run this command on terminal/command prompt: source absolute-path-of-anime_central_db.sql
Now you have created database, tables and inserted everything except images for animes!
If you already have this database but want to have an updated version, just run the command above since it will first remove the database.
If you want to have images as well follow these instructions:
1) Run the following MySQL command on your MySQL command line client or MySQL WorkBench or wherever: select @@secure_file_priv;
2) Copy the folder "anime_pictures" into the location that was the result of the above MySQL command. It should be something like this if you are on Windows: C:\ProgramData\MySQL\MySQL Server 8.0\Uploads and something like this if you are on Linux: /var/lib/mysql-files/
3) In the file image_inserts.sql there are updates that load images with function LOAD_FILE which has one parameter for file path. You should change that parameter to the path from the previous instruction for every anime. For example: it should be C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Uploads\\anime_pictures\\monster.png for anime Monster. Don't forget double \\ if you are on Windows.
4)Run this command on terminal/command prompt: source absolute-path-of-image_inserts.sql
Now you have anime images!
