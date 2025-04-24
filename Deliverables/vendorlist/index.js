let vendors = [];

async function fetchVendors() {
  try {
    const vendorResponse = await fetch('http://localhost:5089/api/Data/0');

    if (!vendorResponse.ok) {
      throw new Error(`HTTP error! status: ${vendorResponse.status}`);
    }

    vendors = await vendorResponse.json();
    console.log('Vendors fetched successfully:', vendors);

    renderVendors(vendors);
  } catch (error) {
   
  }
}

function HandleOnLoad() {
  fetchVendors();

  const filterSelect = document.getElementById("filterSelect");
  if (filterSelect) {
    filterSelect.addEventListener("change", applyFilters);
  }
}

function applyFilters() {
  const selectedValue = document.getElementById("filterSelect").value;
  let filtered = [...vendors];

  if (selectedValue.startsWith("type-")) {
    const type = selectedValue.replace("type-", "").toLowerCase();
    filtered = filtered.filter(v =>
      v.description && v.description.toLowerCase().includes(type)
    );
  } else if (selectedValue === "name-asc") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (selectedValue === "name-desc") {
    filtered.sort((a, b) => b.name.localeCompare(a.name));
  }

  renderVendors(filtered);
}

function renderVendors(data) {
  const vendorGrid = document.getElementById("vendorGrid");
  if (!vendorGrid) return;

  vendorGrid.innerHTML = ""; // Clear previous cards

  data.forEach(vendor => {
    const card = document.createElement("div");
    card.className = "vendor-card";
    card.innerHTML = `
      <img src="${vendor.image}" alt="${vendor.name}">
      <div class="vendor-info">
        <h3>${vendor.name}</h3>
        <p>${vendor.description}</p>
        <a href="${vendor.link}" target="_blank">Read More</a>
      </div>
    `;
    vendorGrid.appendChild(card);
  });
}



// let vendors = [];

// async function fetchVendors() {
//   try {
//     const vendorResponse = await fetch('http://localhost:5089/api/Data/0');

//     if (!vendorResponse.ok) {
//       throw new Error(`HTTP error! status: ${vendorResponse.status}`);
//     }

//     vendors = await vendorResponse.json();
//     console.log('Vendors fetched successfully:', vendors);

//     renderVendors(vendors);
//   } catch (error) {
    
//   }
// }

// function HandleOnLoad() {
//   fetchVendors(); 

//   const filterSelect = document.getElementById("filterSelect");
//   if (filterSelect) {
//     filterSelect.addEventListener("change", applyFilters);
//   }
// }

// function applyFilters() {
//   const selectedValue = document.getElementById("filterSelect").value;
//   let filtered = [...vendors];

//   if (selectedValue.startsWith("type-")) {
//     const type = selectedValue.replace("type-", "").toLowerCase();
//     filtered = filtered.filter(v =>
//       v.description && v.description.toLowerCase().includes(type)
//     );
//   } else if (selectedValue === "name-asc") {
//     filtered.sort((a, b) => a.name.localeCompare(b.name));
//   } else if (selectedValue === "name-desc") {
//     filtered.sort((a, b) => b.name.localeCompare(a.name));
//   }

//   renderVendors(filtered);
// }

// const vendorGrid = document.getElementById("vendorGrid");
// const filterSelect = document.getElementById("filterSelect");

// function renderVendors(data) {
//   vendorGrid.innerHTML = ""; // Clear grid first

//   data.forEach(vendor => {
//     const card = document.createElement("div");
//     card.className = "vendor-card";
//     card.innerHTML = `
//       <img src="${vendor.image}" alt="${vendor.name}">
//       <div class="vendor-info">
//         <h3>${vendor.name}</h3>
//         <p>${vendor.description}</p>
//         <a href="${vendor.link}">Read More</a>
//       </div>
//     `;
//     vendorGrid.appendChild(card);
//   });
// }

// filterSelect.addEventListener("change", () => {
//   let filtered = [...vendors]; // Copy array
//   const value = filterSelect.value;

//   if (value === "name-asc") {
//     filtered.sort((a, b) => a.name.localeCompare(b.name));
//   } else if (value === "name-desc") {
//     filtered.sort((a, b) => b.name.localeCompare(a.name));
//   } else if (value === "type-fashion") {
//     filtered = filtered.filter(v => v.description.toLowerCase().includes("fashion"));
//   } else if (value === "type-bbq") {
//     filtered = filtered.filter(v => v.description.toLowerCase().includes("bbq"));
//   } else if (value === "type-art") {
//     filtered = filtered.filter(v => v.description.toLowerCase().includes("art"));
//   } else if (value === "type-tech") {
//     filtered = filtered.filter(v => v.description.toLowerCase().includes("tech"));
//   } // No else — just render all by default if not matched

//   renderVendors(filtered);
// });

// // Initial render
// renderVendors(vendors);





// const vendors = [
//   {
//     name: "Gourmet Galaxy",
//     description: "Artisan chocolates and international sweets.",
//     image: "https://via.placeholder.com/400x250/8B0000/ffffff?text=Chocolates",
//     link: "#"
//   },
//   {
//     name: "EcoLeaf Crafts",
//     description: "Eco-friendly home goods and plant decor.",
//     image: "https://via.placeholder.com/400x250/228B22/ffffff?text=Eco+Crafts",
//     link: "#"
//   },
//   {
//     name: "PixelPop Games",
//     description: "Retro arcade games and VR experiences.",
//     image: "https://via.placeholder.com/400x250/000080/ffffff?text=Gaming",
//     link: "#"
//   },
//   {
//     name: "Urban Threads",
//     description: "Handmade streetwear & local fashion.",
//     image: "https://via.placeholder.com/400x250/696969/ffffff?text=Fashion",
//     link: "#"
//   },
//   {
//     name: "Sunset Pottery",
//     description: "Locally-made ceramic art and cookware.",
//     image: "https://via.placeholder.com/400x250/CD853F/ffffff?text=Pottery",
//     link: "#"
//   },
//   {
//     name: "Sizzle & Smoke BBQ",
//     description: "Award-winning BBQ & live cooking demos.",
//     image: "https://via.placeholder.com/400x250/800000/ffffff?text=BBQ",
//     link: "#"
//   },
//   {
//     name: "Luxe Living Co.",
//     description: "Smart home tech and designer furniture.",
//     image: "https://via.placeholder.com/400x250/2F4F4F/ffffff?text=Smart+Home",
//     link: "#"
//   },
//   {
//     name: "Canvas & Color",
//     description: "Interactive painting booths and art kits.",
//     image: "https://via.placeholder.com/400x250/FF6347/ffffff?text=Art+Booth",
//     link: "#"
//   },
//   {
//     name: "Tropical Sips",
//     description: "Fresh juices, smoothies, and exotic drinks.",
//     image: "https://via.placeholder.com/400x250/FFA500/ffffff?text=Smoothies",
//     link: "#"
//   }
// ];

// const vendorGrid = document.getElementById("vendorGrid");
// const sortSelect = document.getElementById("sortSelect");
// const typeSelect = document.getElementById("typeSelect");

// function renderVendors(data) {
//   vendorGrid.innerHTML = "";
//   data.forEach(vendor => {
//     const card = document.createElement("div");
//     card.className = "vendor-card";
//     card.innerHTML = `
//       <img src="${vendor.image}" alt="${vendor.name}">
//       <div class="vendor-info">
//         <h3>${vendor.name}</h3>
//         <p>${vendor.description}</p>
//         <a href="${vendor.link}">Read More</a>
//       </div>
//     `;
//     vendorGrid.appendChild(card);
//   });
// }

// function applyFilters() {
//   let filtered = [...vendors];

//   // Apply type filter
//   const selectedType = typeSelect.value;
//   if (selectedType) {
//     filtered = filtered.filter(v =>
//       v.description.toLowerCase().includes(selectedType.toLowerCase())
//     );
//   }

//   // Apply sort
//   const sortValue = sortSelect.value;
//   if (sortValue === "name-asc") {
//     filtered.sort((a, b) => a.name.localeCompare(b.name));
//   } else if (sortValue === "name-desc") {
//     filtered.sort((a, b) => b.name.localeCompare(a.name));
//   }

//   renderVendors(filtered);
// }

// sortSelect.addEventListener("change", applyFilters);
// typeSelect.addEventListener("change", applyFilters);

// // Initial render
// renderVendors(vendors);




