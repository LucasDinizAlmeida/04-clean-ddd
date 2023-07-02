import { expect, describe, beforeEach, it } from 'vitest'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: GetQuestionBySlugUseCase

describe('Get Question By Slug', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository)
  })

  it('should be able question by slug', async () => {
    const newQuestion = makeQuestion({
      slug: Slug.create('titulo-da-pergunta'),
    })
    inMemoryQuestionsRepository.create(newQuestion)

    const result = await sut.execute({
      slug: 'titulo-da-pergunta',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.question.id).toEqual(newQuestion.id)
    }
  })
})
