// producttion data
let productData = [];
// get products data
const getProductsData = async () => {
  try {
    const response = await baseService.get("/products");
    productData = response.data.products;
    renderPorductionSection(productData);
  } catch (error) {
    console.log(error.response.data.message);
  }
};

const productUlSection = document.querySelector(".productWrap");
// render product section
const renderPorductionSection = (datas) => {
  const renderData = createProductTemplate(datas);
  productUlSection.innerHTML = renderData;
};
// filte section selector
const category = document.querySelector(".productSelect");
// filte category of product
const filteProductCategory = () => {
  let newRenderData = [];
  if (category.value !== "全部") {
    newRenderData = productData.filter((item) => {
      return item.category === category.value;
    });
  } else {
    newRenderData = productData;
  }
  renderPorductionSection(newRenderData);
};

// carts data
let cartsData = [];
// get carts data
const getCartsData = async () => {
  try {
    const response = await baseService.get("/carts");
    cartsData = response.data.carts;
    renderCartsSection(cartsData);
  } catch (error) {
    console.log(error.response.data.message);
  }
};

const cartsSection = document.querySelector(".shoppingCart-table");
// render carts section
const renderCartsSection = (datas) => {
  let renderData = createCarsTemplate(datas);
  cartsSection.innerHTML = renderData;
};

// patch carts data

const patchCartsData = async (data) => {
  try {
    const response = await baseService.patch("/carts", data);
    console.log(response);
    getCartsData();
  } catch (error) {
    console.log(error.response.data.message);
  }
};
// post carts data

const postCartsData = async (data) => {
  try {
    await baseService.post("/carts", data);
    getCartsData();
  } catch (error) {
    console.log(error.response.data.message);
  }
};
const productCard = document.querySelector(".productWrap");
// listener for add carts button
productCard.addEventListener("click", function (e) {
  if (e.target.getAttribute("class") !== "addCardBtn") {
    return;
  }
  const idx = e.target.getAttribute("data-idx");
  let cartData = cartsData.filter((item) => {
    return item.product.id === productData[idx].id;
  });
  if (cartData.length !== 0) {
    let patchData = {
      data: {
        id: cartData[0]["id"],
        quantity: cartData[0]["quantity"] + 1,
      },
    };
    patchCartsData(patchData);
    alert("更新購物車");
  } else {
    let postData = {
      data: {
        productId: productData[idx].id,
        quantity: 1,
      },
    };
    postCartsData(postData);
    alert("加入購物車");
  }
});

// delete item in carts
const deleteCartsItem = async (id) => {
  try {
    await baseService.delete(`/carts/${id}`);
    getCartsData();
  } catch (error) {
    console.log(error.response.data.message);
  }
};

// delete all items in carts

const deleteAllCartsItem = async () => {
  try {
    await baseService.delete("/carts");
    getCartsData();
  } catch (error) {
    alert(error.response.data.message);
  }
};

const cartsTable = document.querySelector(".shoppingCart-table");

// listen if delete btn of item id click or not
cartsTable.addEventListener("click", (e) => {
  // console.log(e.target.getAttribute("class"));
  if (e.target.getAttribute("class") === "material-icons") {
    const id = e.target.getAttribute("data-id");
    deleteCartsItem(id);
  } else if (e.target.getAttribute("class") === "discardAllBtn") {
    deleteAllCartsItem();
    alert("清空購物車");
  }
});

// post order to backend

const orderForm = document.querySelector(".orderInfo-form");

category.addEventListener("change", filteProductCategory);

// initial the order information empty alert message
const formsAlert = document.querySelectorAll(".orderInfo-message");
const initialOrderInfoMessage = () => {
  formsAlert.forEach((item) => {
    item.innerHTML = "";
  });
};

const orderInputs = document.querySelectorAll(".orderInfo-input");
const postOrderBtn = document.querySelector(".orderInfo-btn");

const orderInfoData = {
  data: {
    user: {
      name: "",
      tel: "",
      email: "",
      address: "",
      payment: "",
    },
  },
};

// extract post data from input value
const extractInputData = (item) => {
  if (item.getAttribute("id") === "customerName") {
    orderInfoData["data"]["user"]["name"] = item.value;
  } else if (item.getAttribute("id") === "customerPhone") {
    orderInfoData["data"]["user"]["tel"] = item.value;
  } else if (item.getAttribute("id") === "customerEmail") {
    orderInfoData["data"]["user"]["email"] = item.value;
  } else if (item.getAttribute("id") === "customerAddress") {
    orderInfoData["data"]["user"]["address"] = item.value;
  } else if (item.getAttribute("id") === "tradeWay") {
    orderInfoData["data"]["user"]["payment"] = item.value;
  }
};
// check input is empty or not
const checkInputDataEmpty = () => {
  let result = true;
  orderInputs.forEach((item) => {
    extractInputData(item);
    if (item.id === "tradeWay") {
      return;
    }
    if (item.value === "") {
      item.parentNode.querySelector(".orderInfo-message").innerHTML = "必填";
      result = false;
      return;
    }
    item.parentNode.querySelector(".orderInfo-message").innerHTML = "";
  });
  return result;
};
// post order to backend
const postOrderData = async (data) => {
  try {
    await baseService.post("/orders", data);
    alert("成功送出訂單!");
  } catch (error) {
    console.log(error.response.data.message);
  }
  getCartsData();
};
// listen if btm has been click
orderForm.addEventListener("click", async (e) => {
  e.preventDefault();
  const currentClass = e.target.getAttribute("class");
  if (currentClass === "orderInfo-btn") {
    const result = checkInputDataEmpty();
    console.log(result);
    if (result === true) {
      postOrderData(orderInfoData);
      document.querySelector(".orderInfo-form").reset();
    }
  }
});

// initial function
function init() {
  getProductsData();
  getCartsData();
  initialOrderInfoMessage();
}
init();
