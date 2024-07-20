import { app } from '@/infrastructure/app-config'
import { migrator } from '@/infrastructure/db-config'
import { configDotenv } from 'dotenv'

configDotenv()

await migrator.up()

const port: number = Number(process.env.PORT) || 3000

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})
