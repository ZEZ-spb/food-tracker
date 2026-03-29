import 'reflect-metadata'
import app from './app'
import { AppDataSource } from './config/database'

const PORT = process.env.PORT || 3000

AppDataSource.initialize()
  .then(() => {
    console.log('✅ База данных подключена')
    app.listen(PORT, () => {
      console.log(`✅ Сервер запущен на порту ${PORT}`)
    })
  })
  .catch((error) => {
    console.error('❌ Ошибка подключения к базе данных:', error)
    process.exit(1)
  })