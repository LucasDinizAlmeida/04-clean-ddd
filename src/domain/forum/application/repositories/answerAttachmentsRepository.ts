import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'

export interface AnswerAttachmensRepository {
  findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]>
  delete(answerId: string): Promise<void>
}
