import { httpService } from './http.service'

const BASE_URL = '/forgotPassword'

export const forgotPasswordService = {
    generateCode,
    validateCode,
    changePassword,
}

async function generateCode(email: string): Promise<void> {
    await httpService.post(`${BASE_URL}/generateCode`, { email })
}

async function validateCode(email: string, code: string): Promise<string> {
    const response = await httpService.post<{ forgotPasswordToken: string }>(
        `${BASE_URL}/validateCode`,
        { email, code }
    )
    return response.forgotPasswordToken
}

async function changePassword(newPassword: string, forgotPasswordToken: string): Promise<void> {
    await httpService.put(`${BASE_URL}/changePassword`, { newPassword }, forgotPasswordToken)
}
