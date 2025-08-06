export interface Subject {
  id: string
  name: string
  code: string
  starts_with_letter: string
  has_pyqs: boolean
  has_notes: boolean
  created_at: string
  updated_at?: string
}