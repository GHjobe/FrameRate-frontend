import { delay } from './client'
import { providers, regions, languages } from '@/mocks/onboarding'

export const getOnboardingOptions = () => delay({ providers, regions, languages })