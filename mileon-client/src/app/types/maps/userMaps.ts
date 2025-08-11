import { GenderEnum, InspectorEnforcementActionEnum, UserTypeEnum } from "../enum/userEnums"

export const inspectorEnforcementActionMap = new Map<number, InspectorEnforcementActionEnum>()
inspectorEnforcementActionMap.set(1, InspectorEnforcementActionEnum.LOCKED)
inspectorEnforcementActionMap.set(2, InspectorEnforcementActionEnum.DRAGGED)

export const userTypeMap = new Map<number, UserTypeEnum>()
userTypeMap.set(1, UserTypeEnum.LEGALCOUNSEL)
userTypeMap.set(2, UserTypeEnum.REFERENT)

export const GenderMap = new Map<number, GenderEnum>()
GenderMap.set(1, GenderEnum.MALE)
GenderMap.set(2, GenderEnum.FEMALE)
GenderMap.set(3, GenderEnum.OTHER)

export const GenderReversMap = new Map<GenderEnum, number>()
GenderReversMap.set(GenderEnum.MALE, 1)
GenderReversMap.set(GenderEnum.FEMALE, 2)
GenderReversMap.set(GenderEnum.OTHER, 3)

