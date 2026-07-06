export type Difficulty = 'easy' | 'medium' | 'hard'

export const DIFFICULTY_CONFIG: Record<Difficulty, { label: string; startingCash: number; bankruptcyThreshold: number }> = {
  easy:   { label: 'Easy',   startingCash: 1_000,   bankruptcyThreshold: 10 },
  medium: { label: 'Medium', startingCash: 10_000,  bankruptcyThreshold: 100 },
  hard:   { label: 'Hard',   startingCash: 100_000, bankruptcyThreshold: 1_000 },
}

export type SessionPayload = {
  userId: string
  username: string
  expiresAt: Date
}

export type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string }
