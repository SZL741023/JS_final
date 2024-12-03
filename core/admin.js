let ordersData = [];
// get orders data
const getOrdersData = async () => {
  try {
    const response = await adminService.get("");
    ordersData = response.data.orders;
    renderOrderSection(ordersData);
    covertOrderDataForC3(ordersData);
    renderC3(orderDataForC3, colorDataForC3);
  } catch (error) {
    console.log(error.response.data.message);
  }
};
// render order section
const orderContent = document.querySelector(".orderPage-table-body");
const renderOrderSection = (data) => {
  let renderData = createOrdersTemplate(data);
  console.log(renderData);
  orderContent.innerHTML = renderData;
};

// delete one order
const deleteOneOrder = async (id) => {
  try {
    await adminService.delete(`/${id}`);
    alert(`刪除${id}訂單`);
    getOrdersData();
  } catch (error) {
    console.log(error.response.data.message);
  }
};
// change order status

const changeOrderStatus = (id) => {
  let orderData = {
    data: {
      id: id,
      paid: true,
    },
  };
  try {
    adminService.put("", orderData);
    getOrdersData();
    alert("狀態已更新");
  } catch (error) {
    console.log(error.response.data.message);
  }
};
orderContent.addEventListener("click", (e) => {
  if (e.target.getAttribute("class") === "delSingleOrder-Btn") {
    const idx = e.target.getAttribute("data-idx");
    const cartId = ordersData[idx].id;
    deleteOneOrder(cartId);
  } else if (e.target.getAttribute("class") === "changeOrderStatus") {
    const idx = e.target.getAttribute("data-idx");
    const cartId = ordersData[idx].id;
    changeOrderStatus(cartId);
  }
});

// delete all orders
const deleteAllOrders = async () => {
  try {
    await adminService.delete("", headers);
    alert("刪除全部訂單");
    getOrdersData();
  } catch (error) {
    console.log(error.response.data.message);
  }
};
const deleteAllBtn = document.querySelector(".discardAllBtn");
deleteAllBtn.addEventListener("click", () => {
  deleteAllOrders();
});

// convert data to object type with title and count
const convertOrdersDataToObj = (ordersData) => {
  let convertData = {};
  ordersData.forEach((order) => {
    order.products.forEach((product) => {
      if (convertData[product.title] === undefined) {
        convertData[product.title] = product.quantity;
      } else {
        convertData[product.title] += product.quantity;
      }
    });
  });
  return convertData;
};
// convert object data to c3 data type
const convertObjDataToC3 = (objData) => {
  const keys = Object.keys(objData);
  let arrayDataForC3 = [];
  keys.forEach((key) => {
    let data = [];
    data.push(key);
    data.push(objData[key]);
    arrayDataForC3.push(data);
  });
  arrayDataForC3.sort((a, b) => b[1] - a[1]);
  return arrayDataForC3;
};
let orderDataForC3 = [];
let colorDataForC3 = {};
// create top3 columns type
const createTop3ColumnsToC3 = (convertedArrayData) => {
  const top3Data = convertedArrayData.filter((data, index) => {
    return index < 3;
  });
  const othersData = convertedArrayData.filter((data, index) => {
    return index > 2;
  });
  if (othersData.length !== 0) {
    let lastData = ["其他", 0];
    othersData.forEach((data) => {
      lastData[1] += data[1];
    });
    top3Data.push(lastData);
  }
  return top3Data;
};
// create top3 color type
const createTop3ColorToC3 = (convertedArrayData) => {
  let colorOfTop3 = {};
  const color = ["#DACBFF", "#9D7FEA", "#5434A7", "#301E5F"];
  convertedArrayData.forEach((item, index) => {
    colorOfTop3[item[0]] = color[index];
  });
  return colorOfTop3;
};

// convert order data for C3 render
const covertOrderDataForC3 = (ordersData) => {
  let productSummaryData = convertOrdersDataToObj(ordersData);

  let convertedArrayData = convertObjDataToC3(productSummaryData);
  orderDataForC3 = createTop3ColumnsToC3(convertedArrayData);
  colorDataForC3 = createTop3ColorToC3(orderDataForC3);
};

// render c3 form
const renderC3 = (columns, colors) => {
  let chart = c3.generate({
    bindto: "#chart", // HTML 元素綁定
    data: {
      type: "pie",
      columns: columns,
      colors: colors,
    },
  });
};
// initial function
function init() {
  getOrdersData();
}
init();
