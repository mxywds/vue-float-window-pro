/**
 * 将尺寸值转换为像素值
 * @param sizeValue
 * @param isHeight
 * @returns {*|number}
 * @private
 */
export const _convertToPx = (sizeValue, isHeight = false) => {
  const screenWidth = window.innerWidth
  const screenHeight = window.innerHeight
  if (typeof sizeValue === 'number') {
    // 如果宽度已经是数字，则假定为像素值，无需转换
    return sizeValue
  } else if (typeof sizeValue === 'string') {
    // 正则表达式匹配字符串中的数字部分
    const match = sizeValue.match(/(\d+(\.\d+)?)\s*(px|vw|vh|%)/)
    if (match) {
      const value = parseFloat(match[1]) // 提取匹配的数字部分并转换为浮点数
      const unit = match[3] // 提取匹配的单位
      switch (unit) {
        case 'px':
          return value // 如果单位已经是像素，则无需转换
        case 'vw':
          // 根据视口宽度进行转换
          return (value * screenWidth / 100)
        case 'vh':
          // 根据视口高度进行转换
          return (value * screenHeight / 100)
        case '%': {
          if (isHeight) {
            const parentElementHeight = this.parentElementHeight
            return (value * parentElementHeight / 100)
          }
          const parentElementWidth = this.parentElementWidth
          return (value * parentElementWidth / 100)
        }
      }
    }
  }
  // 如果无法匹配或不是支持的单位，则返回原始值
  return sizeValue
}

/**
 * 将尺寸值转换为vw值
 * @param sizeValue
 * @param isHeight
 * @returns {*|number}
 * @private
 */
export const _convertToVw = (sizeValue, isHeight = false) => {
  const screenWidth = window.innerWidth
  const screenHeight = window.innerHeight
  if (typeof sizeValue === 'number') {
    // 如果宽度已经是数字，则假定为vw值，无需转换
    return sizeValue
  } else if (typeof sizeValue === 'string') {
    // 正则表达式匹配字符串中的数字部分
    const match = sizeValue.match(/(\d+(\.\d+)?)\s*(px|vw|vh|%)/)
    if (match) {
      const value = parseFloat(match[1]) // 提取匹配的数字部分并转换为浮点数
      const unit = match[3] // 提取匹配的单位
      switch (unit) {
        case 'px':
          return ((value / screenWidth) * 100)
        case 'vw':
          return value
        case 'vh':
          return (value * screenHeight) / screenWidth
        case '%': {
          if (isHeight) {
            const parentElementHeight = this.parentElementHeight
            return (value * parentElementHeight / 100)
          }
          const parentElementWidth = this.parentElementWidth
          return (value * parentElementWidth / 100)
        }
      }
    }
  }
  // 如果无法匹配或不是支持的单位，则返回原始值
  return sizeValue
}

/**
 * 将尺寸值转换为vh值
 * @param sizeValue
 * @param isHeight
 * @returns {*|number}
 * @private
 */
export const _convertToVh = (sizeValue, isHeight = false) => {
  const screenWidth = window.innerWidth
  const screenHeight = window.innerHeight
  if (typeof sizeValue === 'number') {
    // 如果宽度已经是数字，则假定为vw值，无需转换
    return sizeValue
  } else if (typeof sizeValue === 'string') {
    // 正则表达式匹配字符串中的数字部分
    const match = sizeValue.match(/(\d+(\.\d+)?)\s*(px|vw|vh|%)/)
    if (match) {
      const value = parseFloat(match[1]) // 提取匹配的数字部分并转换为浮点数
      const unit = match[3] // 提取匹配的单位
      switch (unit) {
        case 'px':
          return ((value / screenHeight) * 100)
        case 'vw':
          return (value * screenWidth) / screenHeight
        case 'vh':
          return value
        case '%': {
          if (isHeight) {
            const parentElementHeight = this.parentElementHeight
            return (value * parentElementHeight / 100)
          }
          const parentElementWidth = this.parentElementWidth
          return (value * parentElementWidth / 100)
        }
      }
    }
  }
  // 如果无法匹配或不是支持的单位，则返回原始值
  return sizeValue
}
