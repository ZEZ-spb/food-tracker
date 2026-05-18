// import 'reflect-metadata'
// import app from './app'
// import { AppDataSource } from './config/database'

// const PORT = process.env.PORT || 3000

// AppDataSource.initialize()
//   .then(() => {
//     console.log('✅ База данных подключена')
//     app.listen(PORT, () => {
//       console.log(`✅ Сервер запущен на порту ${PORT}`)
//     })
//   })
//   .catch((error) => {
//     console.error('❌ Ошибка подключения к базе данных:', error)
//     process.exit(1)
//   })


import 'reflect-metadata'
import app from './app'
import { AppDataSource } from './config/database'

const PORT = process.env.PORT || 3000

const connectWithRetry = async (retries = 10, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await AppDataSource.initialize()
      console.log('✅ База данных подключена')
      app.listen(PORT, () => {
        console.log(`✅ Сервер запущен на порту ${PORT}`)
      })
      return
    } catch (error) {
      console.error(`❌ Ошибка подключения к БД (попытка ${i + 1}/${retries}):`, error)
      if (i < retries - 1) {
        console.log(`⏳ Повтор через ${delay / 1000} сек...`)
        await new Promise(res => setTimeout(res, delay))
      }
    }
  }
  console.error('❌ Не удалось подключиться к БД после всех попыток')
  process.exit(1)
}

connectWithRetry()