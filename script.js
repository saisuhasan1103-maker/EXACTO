document.addEventListener("DOMContentLoaded", function() {

const gstData = {

    "Fruits": {
        type: "weight",
        gst: 0,
        items: [
            "Apple","Apricot","Avocado","Banana","Blackberry","Blueberry",
            "Cherry","Coconut","Custard Apple","Dates","Dragon Fruit",
            "Fig","Grapes","Guava","Kiwi","Litchi","Mango","Muskmelon",
            "Orange","Papaya","Passion Fruit","Peach","Pear",
            "Pineapple","Plum","Pomegranate","Raspberry",
            "Strawberry","Watermelon"
        ]
    },

    "Vegetables": {
        type: "weight",
        gst: 0,
        items: [
            "Ash Gourd","Beetroot","Bitter Gourd","Bottle Gourd","Brinjal",
            "Broccoli","Cabbage","Capsicum","Carrot","Cauliflower","Celery",
            "Cluster Beans","Corn","Cucumber","Drumstick","Garlic","Ginger",
            "Green Beans","Green Peas","Kale","Lady Finger","Lettuce",
            "Mushroom","Onion","Potato","Pumpkin","Radish","Spinach",
            "Sweet Potato","Tomato","Turnip","Zucchini"
        ]
    },

    "Grocery": {
        type: "quantity",
        gst: 5,
        items: [
            "Atta","Basmati Rice","Black Pepper","Chana Dal","Chilli Powder",
            "Cooking Oil","Coriander Powder","Flour","Gram Flour","Honey",
            "Jeera","Maida","Mustard Seeds","Poha","Rava","Salt","Sugar",
            "Tea Powder","Toor Dal","Turmeric Powder","Corn Flour",
            "Dry Fruits Mix","Instant Noodles","Ketchup","Pasta","Pickle",
            "Sauce","Sooji","Vermicelli"
        ]
    },

    "Dairy": {
        type: "quantity",
        gst: 5,
        items: [
            "Butter","Cheese","Cream","Curd","Ghee","Ice Cream",
            "Milk","Milk Powder","Paneer","Yogurt"
        ]
    },

    "Electronics": {
        type: "quantity",
        gst: 18,
        items: [
            "Air Conditioner","Bluetooth Speaker","Camera",
            "Desktop Computer","Electric Kettle","Gaming Console",
            "Headphones","Laptop","Microwave Oven","Mobile Phone",
            "Power Bank","Printer","Refrigerator","Smart Watch",
            "Tablet","Television","Washing Machine","Water Purifier",
            "Induction Stove","Ceiling Fan"
        ]
    },

    "Clothing": {
        type: "quantity",
        gst: 12,
        items: [
            "Blazer","Dress","Hoodie","Jacket","Jeans","Kurta",
            "Leggings","Night Suit","Saree","Shirt","Shoes",
            "Shorts","Skirt","Socks","Suit","Sweater",
            "T-Shirt","Track Pants","Trousers","Cap"
        ]
    },

    "Household Items": {
        type: "quantity",
        gst: 18,
        items: [
            "Air Freshener","Detergent Powder","Dish Wash Liquid",
            "Floor Cleaner","Garbage Bags","Hand Wash","Mop",
            "Phenyl","Room Spray","Soap","Sponge",
            "Toilet Cleaner","Toothpaste","Trash Can","Bucket"
        ]
    },

    "Pharmaceuticals": {
        type: "quantity",
        gst: 12,
        items: [
            "Antibiotic","Bandage","Cough Syrup","Diabetes Medicine",
            "First Aid Kit","Hand Sanitizer","Life Saving Drug",
            "Pain Relief Spray","Thermometer","Vitamin Tablets"
        ]
    },

    "Automobiles": {
        type: "quantity",
        gst: 28,
        items: [
            "Car","Electric Vehicle","Motorcycle","Scooter","Truck"
        ]
    },

    "Luxury & Sin Goods": {
        type: "quantity",
        gst: 28,
        items: [
            "Cigarettes","Gold Jewellery","Luxury Watch",
            "Premium Perfume","Wine"
        ]
    }

};

const categorySelect = document.getElementById("category");
const itemSelect = document.getElementById("item");
const quantityField = document.getElementById("quantityField");
const weightField = document.getElementById("weightField");

let cart = [];

Object.keys(gstData).sort().forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
});

categorySelect.addEventListener("change", function() {

    itemSelect.innerHTML = '<option value="">-- Select Item --</option>';
    quantityField.style.display = "none";
    weightField.style.display = "none";

    const selected = gstData[this.value];
    if (!selected) return;

    if (selected.type === "weight") {
        weightField.style.display = "block";
    } else {
        quantityField.style.display = "block";
    }

    selected.items.sort().forEach(item => {
        const option = document.createElement("option");
        option.value = item;
        option.textContent = item;
        itemSelect.appendChild(option);
    });
});

window.addItem = function() {

    const category = categorySelect.value;
    const item = itemSelect.value;
    const price = parseFloat(document.getElementById("price").value);
    const itemDiscount = parseFloat(document.getElementById("itemDiscount").value) || 0;

    if (!category || !item || !price) {
        alert("Fill all details!");
        return;
    }

    const data = gstData[category];
    const quantity = data.type === "weight"
        ? parseFloat(document.getElementById("weight").value)
        : parseFloat(document.getElementById("quantity").value);

    if (!quantity) {
        alert("Enter quantity or weight!");
        return;
    }

    cart.push({ category, item, price, quantity, gst: data.gst, itemDiscount });
    renderCart();
};

function renderCart() {
    const cartDiv = document.getElementById("cartList");
    cartDiv.innerHTML = "";

    cart.forEach((p, i) => {
        cartDiv.innerHTML += `
            <div>
                ${p.item} (${p.quantity}) - ₹${p.price}
                | Discount: ${p.itemDiscount}%
                <button onclick="removeItem(${i})">Remove</button>
            </div>
        `;
    });
}

window.removeItem = function(index) {
    cart.splice(index, 1);
    renderCart();
};

window.calculateFinalBill = function() {

    if (cart.length === 0) {
        alert("Cart empty!");
        return;
    }

    let billHTML = `<h3>FINAL BILL SUMMARY</h3>`;
    let grandTotal = 0;

    cart.forEach((p, index) => {

        let originalAmount = p.price * p.quantity;
        let discountAmount = originalAmount * p.itemDiscount / 100;
        let afterDiscount = originalAmount - discountAmount;
        let gstAmount = afterDiscount * p.gst / 100;
        let finalItemTotal = afterDiscount + gstAmount;

        grandTotal += finalItemTotal;

        billHTML += `
            <div style="margin-bottom:20px; padding:10px; border-bottom:1px solid #333;">
                <strong>Item ${index + 1}: ${p.item}</strong><br>
                Original Amount: ₹${originalAmount.toFixed(2)}<br>
                Discount: ₹${discountAmount.toFixed(2)}<br>
                Amount After Discount: ₹${afterDiscount.toFixed(2)}<br>
                GST (${p.gst}%): ₹${gstAmount.toFixed(2)}<br>
                <strong>Final Item Total: ₹${finalItemTotal.toFixed(2)}</strong>
            </div>
        `;
    });

    billHTML += `
        <hr>
        <h2 style="color:#ff4444;">TOTAL BILL: ₹${grandTotal.toFixed(2)}</h2>
    `;

    document.getElementById("result").innerHTML = billHTML;
};

});