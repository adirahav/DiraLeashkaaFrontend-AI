import { httpService } from './http.service'

const BASE_URL = '/contactUs'

export const contactUsService = {
    sendMessage,
}

async function sendMessage(subject: string, message: string, appEnv: string): Promise<boolean> {
    console.log(`[API] Call API POST '/contactUs' — subject: ${subject}, env: ${appEnv}`)
    const result = await httpService.post<boolean>(BASE_URL, { subject, message, appEnv })
    console.log(`[API] API POST '/contactUs' response: ${result}`)
    return result
}
