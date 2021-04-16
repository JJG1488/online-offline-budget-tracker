// sets transactions to an array. (empty array so that values can be added)
let transactions = [];
// sets myChart to a global variable
let myChart;

// fetch api data
fetch("/api/transaction")
// then change the response to json format
  .then(response => {
    return response.json();
  })
  // then create a function that takes in that json data so that it can be manipulated
  .then(data => {
    // save db data on global variable
    transactions = data;

    // call these functions on that data
    // function that reduces transaction amounts to a single total value
    populateTotal();
    // creates a table
    populateTable();
    // creates a chart 
    populateChart();
  });

  // creates a function statement or function declaration called populateTotal()
function populateTotal() {
  // reduce transaction amounts to a single total value

// creates a variable named total, sets it transactions equal to total
// total also sets the initial value used for the reduce method
  let total = transactions.reduce((total, t) => {
    // the reduce method is called on transactions
  // the reduce method takes in two arguments... an arrow function and the number "0"
  // the total is the initial value/ accumulator and t is the current value
    return total + parseInt(t.value);
    // "0" is the current value of the reduce method
  }, 0);
// selects the total id from .... line 19 inside of the index.html file
  let totalEl = document.querySelector("#total");
  // sets the textContent equal to "total"
  totalEl.textContent = total;
}

// creates a function statement or function declaration with the name of populateTable
function populateTable() {
  // selects the "tbody" id from line 44 of the index.html file
  let tbody = document.querySelector("#tbody");
  // sets the innerHTML of "tbody" to an empty string
  tbody.innerHTML = "";

  // calls the forEach method on transactions... the forEach method
  // Performs the specified action for each element in an array.
// @param callbackfn — A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.
// @param thisArg — An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
// in transactions, for each transaction... do something
  transactions.forEach(transaction => {
    // create and populate a table row
    // creating an element named "tr" and saving the element to a variable named "tr"
    let tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${transaction.name}</td>
      <td>${transaction.value}</td>
    `;
// adds the new element "tr" the tbody innerHTML
    tbody.appendChild(tr);
  });
}

function populateChart() {
  // copy array and reverse it
  // copy array and reverse it
  // calls the .slice method and the .reversed method on the array called transaction and sets the value equal to a variable named reversed
  // .slice returns a copy of a section of an array. 
  // .reverse - Reverses the elements in an array in place. This method mutates the array and returns a reference to the same array.
  let reversed = transactions.slice().reverse();
  // sets the value of the sum variable equal to 0 
  let sum = 0;

  // create date labels for chart
  // calls the map function on the "reversed" variable and set it equal to labels 
  let labels = reversed.map(t => {
    // sets a variable "date" equal to a new Date object that is created by calling the "new Date()" constructor
// the date constructor sets the value of t.date equal to the variable "date"
    let date = new Date(t.date);
    // the map method returns the value of date as a string
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  });

  // create incremental values for chart
  // calls the map method on the variable "reversed" and sets it equal to data
  let data = reversed.map(t => {
    // takes the variable sum and adds it to the value of the function parameter "t"
    sum += parseInt(t.value);
    //  returns the variable "sum"
    return sum;
  });

  // remove old chart if it exists
  // conditional that says... if the chart exists...
  if (myChart) {
    // destroy the chart
    myChart.destroy();
  }

// selects the id "my-chart" from line 48 inside of the index.html
  // the getContext() method returns a drawing context on the canvas, 
  // or null if the context identifier is not supported, 
  // or the canvas has already been set to a different context mode.
  let ctx = document.getElementById("myChart").getContext("2d");

  // constructs a new chart object
  // sets the charts type to "line"..
  // the "data" key has an object with 
  myChart = new Chart(ctx, {
    type: 'line',
      data: {
        labels,
        datasets: [{
            label: "Total Over Time",
            fill: true,
            backgroundColor: "#6666ff",
            data
        }]
    }
  });
}

function sendTransaction(isAdding) {
  let nameEl = document.querySelector("#t-name");
  let amountEl = document.querySelector("#t-amount");
  let errorEl = document.querySelector(".form .error");

  // validate form
  if (nameEl.value === "" || amountEl.value === "") {
    errorEl.textContent = "Missing Information";
    return;
  }
  else {
    errorEl.textContent = "";
  }

  // create record
  let transaction = {
    name: nameEl.value,
    value: amountEl.value,
    date: new Date().toISOString()
  };

  // if subtracting funds, convert amount to negative number
  if (!isAdding) {
    transaction.value *= -1;
  }

  // add to beginning of current array of data
  transactions.unshift(transaction);

  // re-run logic to populate ui with new record
  populateChart();
  populateTable();
  populateTotal();
  
  // also send to server
  fetch("/api/transaction", {
    method: "POST",
    body: JSON.stringify(transaction),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  })
  .then(response => {    
    return response.json();
  })
  .then(data => {
    if (data.errors) {
      errorEl.textContent = "Missing Information";
    }
    else {
      // clear form
      nameEl.value = "";
      amountEl.value = "";
    }
  })
  .catch(err => {
    // fetch failed, so save in indexed db
    saveRecord(transaction);

    // clear form
    nameEl.value = "";
    amountEl.value = "";
  });
}

document.querySelector("#add-btn").onclick = function() {

  sendTransaction(true);
};

document.querySelector("#sub-btn").onclick = function() {
 
  sendTransaction(false);
};
