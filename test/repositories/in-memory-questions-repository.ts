import { PaginationParams } from '@/core/repositories/pagination-params.'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questionsRepository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { InMemoryQuestionAttachmentsRepository } from './in-memory-question-attachments-repository'

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = []

  constructor(
    private inMemoryQuestionAttachments: InMemoryQuestionAttachmentsRepository,
  ) { }

  async findById(id: string) {
    const question = this.items.find((item) => item.id.toString() === id)

    if (!question) {
      return null
    }

    return question
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = this.items.find((item) => item.slug.value === slug)

    if (!question) {
      return null
    }

    return question
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const questions = this.items
      .sort((a, b) => b.createAt.getTime() - a.createAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return questions
  }

  async save(question: Question): Promise<void> {
    const questionIndex = this.items.findIndex(
      (item) => item.id === question.id,
    )

    if (questionIndex === -1) {
      return
    }

    this.items[questionIndex] = question
  }

  async delete(question: Question): Promise<void> {
    const questionIndex = this.items.findIndex(
      (item) => item.id === question.id,
    )

    this.inMemoryQuestionAttachments.delete(question.id.toString())
    this.items.splice(questionIndex, 1)
  }

  async create(question: Question): Promise<void> {
    this.items.push(question)
    // console.log(this.items[0].attachments)
  }
}
