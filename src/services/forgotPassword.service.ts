import { httpService } from './http.service'

const BASE_URL = '/forgotPassword'

export const forgotPasswordService = {
    generateCode,
    validateCode,
    changePassword,
}

async function generateCode(email: string): Promise<void> {
    console.log(`[FORGOT-PASSWORD] Call API POST '/forgotPassword/generateCode' — email: ${email}`)
    await httpService.post(`${BASE_URL}/generateCode`, { email })
    console.log(`[FORGOT-PASSWORD] API POST '/forgotPassword/generateCode' response: code sent`)
}

async function validateCode(email: string, code: string): Promise<string> {
    console.log(`[FORGOT-PASSWORD] Call API POST '/forgotPassword/validateCode' — email: ${email}`)
    const response = await httpService.post<{ forgotPasswordToken: string }>(
        `${BASE_URL}/validateCode`,
        { email, code }
    )
    console.log(`[FORGOT-PASSWORD] API POST '/forgotPassword/validateCode' response: token received`)
    return response.forgotPasswordToken
}

async function changePassword(newPassword: string, forgotPasswordToken: string): Promise<void> {
    console.log(`[FORGOT-PASSWORD] Call API PUT '/forgotPassword/changePassword'`)
    await httpService.put(`${BASE_URL}/changePassword`, { newPassword }, forgotPasswordToken)
    console.log(`[FORGOT-PASSWORD] API PUT '/forgotPassword/changePassword' response: password changed`)
}
