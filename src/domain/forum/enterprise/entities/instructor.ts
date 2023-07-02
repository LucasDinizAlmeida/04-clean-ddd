import { Entity } from '@/core/entities/entity'

interface InstructorProps {
  name: string
}

export class Instructor extends Entity<InstructorProps> {
  static create(props: InstructorProps) {
    const instructor = new Instructor(props)

    return instructor
  }
}
