const createProductTemplate = (datas) => {
  let templateData = "";
  datas.forEach((data, index) => {
    templateData += `<li class="productCard">
                  <h4 class="productType">新品</h4>
                  <img
                    src="${data.images}"
                    alt=""
                  />
                  <a href="#" class="addCardBtn" data-idx="${index}">加入購物車</a>
                  <h3>${data.title}</h3>
                  <del class="originPrice">NT$${data.origin_price}</del>
                  <p class="nowPrice">NT$${data.price}</p>
              </li>`;
  });
  return templateData;
};

const createCarsTemplate = (datas) => {
  let templateData = "";
  let templateContent = "";
  let totalPrice = 0;
  datas.forEach((data) => {
    totalPrice += data.product.price * data.quantity;
    templateContent += `<tr>
              <td>
                <div class="cardItem-title">
                  <img src="${data.product.images}" alt="" />
                  <p>${data.product.title}</p>
                </div>
              </td>
              <td>NT$${data.product.price}</td>
              <td>${data.quantity}</td>
              <td>NT$${data.product.price * data.quantity}</td>
              <td class="discardBtn" >
                <a href="#" class="material-icons" data-id="${
                  data.id
                }"> clear </a>
              </td>
            </tr> `;
  });
  const titleData = `<tr>
            <th width="40%">品項</th>
            <th width="15%">單價</th>
            <th width="15%">數量</th>
            <th width="15%">金額</th>
            <th width="15%"></th>
          </tr>`;
  const buttonData = `<tr>
            <td>
              <a href="#" class="discardAllBtn">刪除所有品項</a>
            </td>
            <td></td>
            <td></td>
            <td>
              <p>總金額</p>
            </td>
            <td>NT$${totalPrice}</td>`;
  templateData = titleData + templateContent + buttonData;
  return templateData;
};
