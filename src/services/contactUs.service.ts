import { httpService } from './http.service'

const SUPPORT_API_URL: string = import.meta.env.VITE_SUPPORT_API_URL


export const contactUsService = {
    sendMessage,
}

async function sendMessage(subject: string, message: string, appEnv: string): Promise<boolean> {
    console.log(`[API] Call API POST '/contactUs' — subject: ${subject}, env: ${appEnv}`)
    const result = await httpService.post<boolean>(SUPPORT_API_URL, { subject, message, appEnv })
    console.log(`[API] API POST '/contactUs' response: ${result}`)
    return result
}
