export const formatDate = (timeInput: string | number[] | any): string => {
  try {
    let date: Date

    // 处理数组格式的时间，如 [2020, 6, 23, 10, 20]
    if (Array.isArray(timeInput)) {
      const [year, month, day] = timeInput
      date = new Date(year, month - 1, day) // month 需要减1
    } else if (typeof timeInput === 'string') {
      // 处理字符串格式
      date = new Date(timeInput)
    } else if (timeInput instanceof Date) {
      // 如果已经是 Date 对象
      date = timeInput
    } else {
      // 其他情况，返回当前时间
      date = new Date()
    }

    // 检查日期是否有效
    if (isNaN(date.getTime())) {
      console.warn('无效的日期格式:', timeInput)
      return '未知时间'
    }

    const year = date.getFullYear()
    const month = date.getMonth() + 1 // 月份从 0 开始，要 +1
    const day = date.getDate()

    // 拼接成 "yyyy/M/d" 格式，比如 "2025/4/25"
    return `${year}/${month}/${day}`
  } catch (error) {
    console.error('日期格式化失败:', error, timeInput)
    return '未知时间'
  }
}
