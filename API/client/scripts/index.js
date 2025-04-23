let myShops = []
async function handleOnLoad() {
  await getAllShops()
  generateShopTable()
}

async function getAllShops() { 
    let response = await fetch('http://localhost:5089/api/Shop')
    myShops = await response.json()
}
function generateShopTable(){
    const appDiv = document.getElementById("app")
    const tbody = document.querySelector('#shopTable tbody');
    tbody.innerHTML = ''
    myShops
        .sort((a, b) => b.rating - a.rating)
        .forEach(shop => {
            const row = document.createElement('tr');
            const showDate = new Date(shop.date).toISOString().split('T')[0];
            let favButton = "Favorite";
            if(shop.favorited === "y"){
              favButton = "Unfavorite"
            }
            row.innerHTML = `
                <td>${shop.name}</td>
                <td>${shop.rating}</td>
                <td>${showDate}</td>
                <td><button onclick="handleOnFavorite(${shop.id})">${favButton}</button></td>
                <td><button onclick="handleOnDelete(${shop.id})">Delete</button></td>
            `;
            tbody.appendChild(row)

        });
}

async function handleClickOnAdd(shopId){
  handleAddShop()
  handleOnLoad()
  generateShopTable()
}
  

async function handleAddShop() {  
  const name = document.getElementById("name").value
  const rating = document.getElementById("rating").value
  const date = document.getElementById("date").value
  const newShop = {id: "0" ,name:name,rating: rating, date: date, favorited: "n"}
  const response = await fetch('http://localhost:5089/api/Shop', {
      method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
      body: JSON.stringify(newShop)
  })
  getAllShops()
  handleOnLoad()
  clearForm()
}


async function handleOnDelete(shopId){
  const response = await fetch(`http://localhost:5089/api/Shop/${shopId}`, {
      method: "DELETE",
      headers: {
          "Content-Type": "application/json"
      }
  })
  handleOnLoad()
}

async function handleOnFavorite(shopId) {
    const response = await fetch(`http://localhost:5089/api/Shop/${shopId}`)
    let myShop = await response.json()
    if (myShop.favorited == "y") {
        myShop.favorited = "n"
    }
    else {
        myShop.favorited = "y"
    }
    console.log(myShop.favorited)
    await fetch(`http://localhost:5089/api/Shop/${shopId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(myShop.favorited)
    })
    getAllShops()
    handleOnLoad()
    console.log(myShops)
}

function clearForm() {
  document.getElementById('name').value = '';
  document.getElementById('rating').value = '';
  document.getElementById('date').value = '';
}
