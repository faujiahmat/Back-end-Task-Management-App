import dotenv from 'dotenv'
dotenv.config()
import express, { type Application } from 'express'
import cors from 'cors'
import appRouter from './routes'
import process from 'process'
import { log } from 'console'

const app: Application = express()
const port: number = process.env.SERVER_PORT
  ? parseInt(process.env.SERVER_PORT)
  : 8080

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(
  cors({
    origin: true,
    credentials: true,
    preflightContinue: false,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
  })
)

app.options('*', cors())

app.use('/api', appRouter)

app.use((req, res, next) => {
  res.status(404).json({ message: 'Page not found' })
})

// Middleware for Internal Server Error
app.use((err: any, req: any, res: any, next: any) => {
  res.status(500).json({ message: 'Internal server error' })
})

app.listen(port, () => {
  log(`Server Running on http://localhost:${port}`)
})
