// 数据格式转换，这个函数用于把后端数据转化为前端能用的格式
export const formatBtoF = (data) => {
  return data.map((item) => ({
    label: item.categoryName,
    value: item.id
  }))
}
