const createOrdersTemplate = (datas) => {
  let orderTemplate = "";
  datas.forEach((data, index) => {
    let productData = "";
    data.products.forEach((product) => {
      productData += `<p>${product.title} x ${product.quantity}</p>`;
    });
    orderTemplate += `<tr>
              <td>${data.id}</td>
              <td>
                <p>${data.user.name}</p>
                <p>${data.user.tel}</p>
              </td>
              <td>${data.user.address}</td>
              <td>${data.user.email}</td>
              <td>
                ${productData}
              </td>
              <td>${convertDataFrame(data.updatedAt)}</td>
              <td class="orderStatus">
                <a href="#" class="changeOrderStatus" data-idx="${index}">${convertPiadToString(data.paid)}</a>
              </td>
              <td>
                <input type="button" class="delSingleOrder-Btn" data-idx="${index}" value="刪除" />
              </td>
            </tr>`;
  });
  return orderTemplate;
};
