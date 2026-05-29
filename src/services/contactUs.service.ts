import { httpService } from './http.service'

const BASE_URL = '/contactUs'

export const contactUsService = {
    sendMessage,
}

async function sendMessage(subject: string, message: string, appEnv: string): Promise<boolean> {
    return httpService.post<boolean>(BASE_URL, { subject, message, appEnv })
}
