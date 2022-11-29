let title = document.getElementById('title');
let priceDiv = document.querySelectorAll('.price input');
let price = document.getElementById('price');
let taxes = document.getElementById('taxes');
let ads = document.getElementById('ads');
let discount = document.getElementById('discount');
let totalPrice = document.getElementById('total');
let count = document.getElementById('count');
let category = document.getElementById('category');
let submit = document.getElementById('submit');
let search = document.getElementById('search');
let searchTitle = document.getElementById('search-title');
let searchCategory = document.getElementById('search-category');
let tableBody = document.getElementById('tbody');
let mood = 'create';
let temp;
// get total price

priceDiv.forEach((inp) => {
    inp.oninput = getTotal;
});

function getTotal() {
    if (price.value) {
        totalPrice.innerHTML = (+price.value + +taxes.value + +ads.value) - +discount.value;
        totalPrice.style.background = 'green';
    } else {
        totalPrice.innerHTML = '';
        totalPrice.style.background = '#f44336';
    }
}



// create product 
let allData;
if (localStorage.product) {
    allData = JSON.parse(localStorage.product);
} else {
    allData = [];
}

submit.onclick = function () {
    createObjectFromData();
    addDataToLocalstorage();
    // clearInputs();
    readData();

};


function createObjectFromData() {
    let item = {
        title: title.value.toLowerCase(),
        price: price.value,
        taxes: taxes.value,
        ads: ads.value.toLowerCase(),
        discount: discount.value,
        totalPrice: totalPrice.innerHTML,
        count: count.value,
        category: category.value.toLowerCase(),
    };

    if (title.value && price.value && category.value && count.value < 100) {

        if (mood === 'create') {
            if (count.value > 1) {
                for (let i = 0; i < count.value; i++) {
                    allData.push(item)
                }
            } else {
                allData.push(item);
            }
        } else {
            allData[temp] = item;

            count.style.display = 'block';
            submit.innerHTML = 'Create';
            mood = 'create';
        }

        clearInputs();
    }


}

function addDataToLocalstorage() {
    localStorage.setItem('product', JSON.stringify(allData))
}

// clear inputs
function clearInputs() {
    title.value = '';
    price.value = '';
    taxes.value = '';
    ads.value = '';
    discount.value = '';
    totalPrice.innerHTML = '';
    count.value = '';
    category.value = '';
}

// read data
function readData() {
    getTotal();
    tableBody.innerHTML = '';
    for (let i = 0; i < allData.length; i++) {
        tbody(i);
    }


    let deleteAll = document.querySelector('.delete-all');
    if (allData.length > 0) {
        deleteAll.innerHTML = `
       <button onclick="deleteAllProduct()" >Delete All (${allData.length})</button>
       `;
    } else {
        deleteAll.innerHTML = '';
    }
}

readData();

function deleteByID(id) {
    allData.splice(id, 1);
    localStorage.product = JSON.stringify(allData);
    readData();
}
// delete All 
function deleteAllProduct() {
    allData.splice(0); // remove all data from array
    localStorage.clear('product');
    readData();
}

//// update
function updateByID(id) {
    title.value = allData[id].title;
    price.value = allData[id].price;
    taxes.value = allData[id].taxes;
    ads.value = allData[id].ads;
    discount.value = allData[id].discount;
    category.value = allData[id].category;
    getTotal();
    count.style.display = 'none';
    submit.innerHTML = 'Update';
    mood = 'update';
    temp = id;
    scroll({
        top: 10,
        behavior: 'smooth'
    });
    title.focus();
}

/// search 
let searchMood = 'title';

function searchType(type) {
    type === 'search-category' ? searchMood = 'category' : searchMood = 'title';
    search.placeholder = 'search by ' + searchMood;
    search.focus();
    search.value = ''
}
search.onkeyup = function () {
    tableBody.innerHTML = '';
    for (let i = 0; i < allData.length; i++) {
        if (searchMood === 'title') {
            if (allData[i].title.includes(search.value.toLowerCase())) {
                tbody(i);
            }

        } else {
            if (allData[i].category.includes(search.value.toLowerCase())) {
                tbody(i);
            }
        }
    }
}


/// create table body content
function tbody(index) {
    tableBody.innerHTML += `
    <tr>
    <td class = "id">${index}</td>
    <td class = "title">${allData[index].title}</td>
    <td class = "Price">${allData[index].price}</td>
    <td class = "ads">${allData[index].ads}</td>
    <td class = "discount">${allData[index].discount}</td>
    <td class = "total">${allData[index].totalPrice}</td>
    <td class = "category">${allData[index].category}</td>
    <td class = "update"><button onclick="updateByID(${index})" >Update</button></td>
    <td class = "delete"><button onclick="deleteByID(${index})">Delete</button></td>
</tr>
    `;
  
}
