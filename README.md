# WDD3600
This code is currently the beginning stages of a website that is created using the tutorial from "Node.js - The Complete Guide" by Maximilian Schwarzmuller.
This website is still in progress and is not yet complete.

## Before download
This website uses Node.js, Express, JavaScript, HTML, and CSS, and sequelize. Before you download the files make sure you have Node.js and Express downloaded.
You can get the latest version of Node.js here: https://nodejs.org/en/download/ .
 You can install Express by opening GitBash ( which you can download here https://git-scm.com/ ) and type ```npm install express``` then press enter.
 This website also uses the templating language ejs. Make sure you install that before running.
 You will also need to connect the code to a database. In this code I use MongoDB, however, feel free to use the database of your choice. 

## To download
To download these files click on the green "Code" button and click "download ZIP". Once the files are done downloading, unzip them and open in text editor of your choice. You can also download them by clicking the green "Code" button and copying the link. Then open GitBash in a selected folder and type ```git clone *link*``` and paste the link after "git clone" and push enter. This will clone all the files to the folder you chose. They can then be opened in a text editor.



## To use once downloaded
To use the files, open them in the text editor of your choice. Go to the "app.js" file and enter your database connection string in the commented area. Next, open the terminal in your code editor. If there is no terminal in the text editor you are using, you can also use GitBash. If you use GitBash, you will need to open the main folder of the downloaded files. Before you can run the app you first need to install the node_modules. You can do this by typeing ```npm install ``` in either GitBash or your terminal. Finally, you can run the app by typing ```npm start``` in GitBash or in your terminal. The app will then open in the browser on localhost:3000.

### Final Structure for Shop App
```
controllers/
├─ admin.js
├─ auth.js
├─ error.js
├─ shop.js

data/
├─ invoices/
├─ cart.json
├─ products.json

images/ (This is where uploaded images are stored)

middleware/
├─ is-auth.js

models/
├─ order.js
├─ product.js
├─ user.js

public/
├─ css/
│  ├─ auth.css
│  ├─ cart.css
│  ├─ forms.css
│  ├─ main.css
│  ├─ orders.css
│  ├─ product.css
├─ js/
│  ├─ admin.js
│  ├─ main.js

routes/
├─ admin.js
├─ auth.js
├─ shop.js

util/
├─ file.js
├─ path.js

views/
├─ admin/
│  ├─ edit-product.ejs
│  ├─ products.ejs
├─ auth/
│  ├─ login.ejs
│  ├─ new-password.ejs
│  ├─ reset.ejs
│  ├─ signup.ejs
├─ includes/
│  ├─ add-to-cart.ejs
│  ├─ end.ejs
│  ├─ head.ejs
│  ├─ navigation.ejs
│  ├─ pagination.ejs
├─ shop/
│  ├─ cart.ejs
│  ├─ checkout.ejs
│  ├─ index.ejs
│  ├─ orders.ejs
│  ├─ product-detail.ejs
│  ├─ product-list.ejs
├─ 404.ejs
├─ 500.ejs

.gitignore
app.js
package.json
README.md
```
### Final Database Structure
```
admin/
local/
├─ clustermanager
├─ oplog.rs
├─ replset.election
├─ replset.initialSyncld
├─ replset.minvalid
├─ replset.oplogTruncateAfterPoint
├─ startup_log
messages/
├─ posts
├─ users
shop/
├─ orders
├─ products
├─ sessions
├─ users
```
