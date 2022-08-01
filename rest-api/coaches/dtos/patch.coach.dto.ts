import { CreateCoachDto } from "./create.coach.dto";

// "Partial" creates a new type by copying another type and making all its fields optional
export type PatchCoachDto = Partial<CreateCoachDto>