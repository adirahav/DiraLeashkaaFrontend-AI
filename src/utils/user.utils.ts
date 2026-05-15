import { User } from '../types'

export function getIsUserCompleted(user: User | null): boolean {
    if (!user) return false
    if (!user.fullname || !user.email) return false
    if (!user.yearOfBirth) return false
    if (!user.termsOfUseAccept) return false

    const equity = Number(user.equity)
    const incomes = Number(user.incomes)
    const commitments = Number(user.commitments)
    if (isNaN(equity) || equity < 0) return false
    if (isNaN(incomes) || incomes < 0) return false
    if (isNaN(commitments) || commitments < 0) return false

    return true
}

export function getNextOnboardingStep(user: User | null): string {
    if (!user) return '/login'
    if (!user.yearOfBirth || !user.fullname) return '/personal-info'

    const equityStr = user.equity?.toString().trim() ?? ''
    const incomesStr = user.incomes?.toString().trim() ?? ''
    const commitmentsStr = user.commitments?.toString().trim() ?? ''

    if (equityStr === '' || incomesStr === '' || commitmentsStr === '') return '/financial-details'

    const equity = Number(equityStr)
    const incomes = Number(incomesStr)
    const commitments = Number(commitmentsStr)
    if (isNaN(equity) || equity < 0 || isNaN(incomes) || incomes < 0 || isNaN(commitments) || commitments < 0) {
        return '/financial-details'
    }

    if (!user.termsOfUseAccept) return '/consent'

    return '/home'
}
