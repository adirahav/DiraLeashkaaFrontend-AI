import { httpService } from './http.service'

const USER_MANAGEMENT_API_URL: string = import.meta.env.VITE_USER_MANAGEMENT_API_URL

export const forgotPasswordService = {
    generateCode,
    validateCode,
    changePassword,
}

async function generateCode(email: string): Promise<void> {
    console.log(`[FORGOT-PASSWORD] Call API POST '/forgotPassword/generateCode' — email: ${email}`)
    await httpService.post(`${USER_MANAGEMENT_API_URL}/forgotPassword/generateCode`, { email })
    console.log(`[FORGOT-PASSWORD] API POST '/forgotPassword/generateCode' response: code sent`)
}

async function validateCode(email: string, code: string): Promise<string> {
    console.log(`[FORGOT-PASSWORD] Call API POST '/forgotPassword/validateCode' — email: ${email}`)
    const response = await httpService.post<{ forgotPasswordToken: string }>(
        `${USER_MANAGEMENT_API_URL}/forgotPassword/validateCode`,
        { email, code }
    )
    console.log(`[FORGOT-PASSWORD] API POST '/forgotPassword/validateCode' response: token received`)
    return response.forgotPasswordToken
}

async function changePassword(newPassword: string, forgotPasswordToken: string): Promise<void> {
    console.log(`[FORGOT-PASSWORD] Call API PUT '/forgotPassword/changePassword'`)
    await httpService.put(`${USER_MANAGEMENT_API_URL}/forgotPassword/changePassword`, { newPassword }, forgotPasswordToken)
    console.log(`[FORGOT-PASSWORD] API PUT '/forgotPassword/changePassword' response: password changed`)
}
