var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon_db"
});

function displayItems() {

  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    console.log("Items Available Are Listed Below");

    for (let i = 0; i < res.length; i++) {
      console.log(`ID: ${res[i].item_id} | Product: ${res[i].product_name} | Price: $${res[i].price}`);
      console.log('-------------------------------------')
    };

    let valid;
    inquirer.prompt([
      {
        name: "item_id",
        type: "input",
        message: "What is the ID for the product you would like to buy? (1 through 10):",
        validate: function validateID(id) {
          if (isNaN(id) || id > res.length || id < 0 || id == "") {
            valid = `ID must be a valid number between 1 and ${res.length}`
          } else {
            return true
          }
          return valid;
        }
      }, {
        name: "quantity",
        type: "input",
        message: "How many would you like? ",
        validate: function validateID(quantity) {
          if (isNaN(quantity) || quantity < 0 || quantity == "") {
            valid = `Select a quantity that is a valid`
          } else {
            return true
          }
          return valid;
        }
      }
    ]).then(function (input) {
      var item = (input.item_id) - 1;
      var quantity = parseInt(input.quantity);
      var total = parseFloat((res[item].price) * quantity).toFixed(2);
      if (quantity <= res[item].stock_quantity) {
        console.log(`Purchase Confirmed! Your total is $${total}. `);
        var updateQty = connection.query(
          "UPDATE products SET ? WHERE ?",
          [
            {
              stock_quantity: res[item].stock_quantity - quantity
            }, {
              item_id: item + 1
            }
          ]
        )
      } else {
        console.log(`Insufficient Quantity Available for Purchase! There are only ${res[item].stock_quantity} available at this time.`)
      }
    })

  })
};

displayItems();