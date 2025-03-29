Follow these steps to run the website in your browser :

1. Click on the green button "Code" on main page of the github repo. Then click on "Download ZIP".
2. Extract the file from the downloaded ZIP.
3. Open VS code, and your terminal in vs code.
4. Enter the command - python app.py
5. Open new terminal(another one) - npm install
6. Then enter - npm start
7. This should open a new tab in your default browser with the url http://localhost:3000
8. The page will automatically reload when you make changes.

Follow these steps to import database in your system :

1. Install mysql 
2. Open mysql command line client
3. Create new database using the command : 
    CREATE DATABASE mutualfund;
4. Close mysql
5. Open Command prompt and run the following command : 
    mysql -u root -p mutualfund < path/to/your/file.sql (Insert the path of .sql file here which you downloaded from the repo)
6. The database is imported you can verify the import by running these commands in mysql command line
    USE mutualfund;
    SHOW tables;
    

