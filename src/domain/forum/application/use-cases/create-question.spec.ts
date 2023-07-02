import { expect, describe, beforeEach, it } from 'vitest'
import { CreateQuestionUseCase } from './create-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: CreateQuestionUseCase

describe('Create a question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    sut = new CreateQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('shoulf=d be able to create a question', async () => {
    const result = await sut.execute({
      authorId: '1',
      title: 'Título da questão',
      content: 'Conteúdo da questão',
      attachmentIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryQuestionsRepository.items[0].id).toEqual(
      result.value?.question.id,
    )
    // console.log(inMemoryQuestionsRepository.items[0].attachments)
    expect(inMemoryQuestionsRepository.items[0].attachments).toMatchObject({
      currentItems: [
        expect.objectContaining({
          props: {
            attachmentId: new UniqueEntityId('1'),
            questionId: result.value?.question.id,
          },
        }),

        expect.objectContaining({
          props: {
            attachmentId: new UniqueEntityId('2'),
            questionId: result.value?.question.id,
          },
        }),
      ],
    })
  })
})
