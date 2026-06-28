import * as dotenv from 'dotenv'
import * as path from 'path'

const ENV_NAME = process.env.ENV_NAME || 'dev'
const envFile = path.resolve(process.cwd(), `config/env/.env.${ENV_NAME}`)

dotenv.config({ path: envFile })

function required(name: string, fallback?: string): string {
    const value = process.env[name] ?? fallback
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`)
    }
    return value
}

export const env = {
    ENV_NAME,
    API_URL: required('API_URL'),
    BASE_URL: required('BASE_URL'),
    HEADLESS: required('HEADLESS'),
    ORANGEHRM_USERNAME: required('ORANGEHRM_USERNAME'),
    ORANGEHRM_PASSWORD: required('ORANGEHRM_PASSWORD')
}
