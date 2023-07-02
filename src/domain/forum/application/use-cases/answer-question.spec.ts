import { expect, describe, beforeEach, it } from 'vitest'
import { AnswerQuestionUseCase } from './answer-question'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'

let inMemoryAnswerRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachementsRepository: InMemoryAnswerAttachmentsRepository
let sut: AnswerQuestionUseCase

describe('Answer a question', () => {
  beforeEach(() => {
    inMemoryAnswerAttachementsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswerRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachementsRepository,
    )
    sut = new AnswerQuestionUseCase(inMemoryAnswerRepository)
  })

  it('should be able to answer a question', async () => {
    const result = await sut.execute({
      instructorId: '1',
      questionId: '1',
      content: 'Resposta da pergunda',
      attachmentIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryAnswerRepository.items[0].id).toEqual(
      result.value?.answer.id,
    )

    expect(inMemoryAnswerRepository.items[0].attachments).toMatchObject({
      currentItems: [
        expect.objectContaining({
          props: {
            attachmentId: new UniqueEntityId('1'),
            answerId: result.value?.answer.id,
          },
        }),

        expect.objectContaining({
          props: {
            attachmentId: new UniqueEntityId('2'),
            answerId: result.value?.answer.id,
          },
        }),
      ],
    })
  })
})
