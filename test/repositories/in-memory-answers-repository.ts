import { PaginationParams } from '@/core/repositories/pagination-params.'
import { AnswersRepository } from '@/domain/forum/application/repositories/answersRepository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { InMemoryAnswerAttachmentsRepository } from './in-memory-answer-attachments-repository'

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = []

  constructor(
    private inMemoryAnswerAttachments: InMemoryAnswerAttachmentsRepository,
  ) { }

  async findById(id: string) {
    const answer = this.items.find((item) => item.id.toString() === id)

    if (!answer) {
      return null
    }

    return answer
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<Answer[]> {
    const answers = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)

    return answers
  }

  async save(answer: Answer): Promise<void> {
    const answerIndex = this.items.findIndex((item) => item.id === answer.id)

    this.items[answerIndex] = answer
  }

  async create(answer: Answer): Promise<void> {
    this.items.push(answer)
  }

  async delete(answer: Answer): Promise<void> {
    const answerIndex = this.items.findIndex((item) => item.id === answer.id)

    this.inMemoryAnswerAttachments.delete(answer.id.toString())
    this.items.splice(answerIndex, 1)
  }
}
