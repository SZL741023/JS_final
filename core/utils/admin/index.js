const convertDataFrame = (timestamp) =>
  new Date(timestamp * 1000).toLocaleString("zh-TW", {
    hour12: false,
  });

const convertPiadToString = (paid) => (paid === true ? "已處理" : "未處理");
