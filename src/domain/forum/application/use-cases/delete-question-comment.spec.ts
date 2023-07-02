import { expect, describe, beforeEach, it } from 'vitest'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DeleteQuestionCommentUseCase } from './delete-question-comment'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { NotAllowedError } from './errors/not-allowed-error'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: DeleteQuestionCommentUseCase

describe('Delete a Question Comment', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should be able to delete a question comment', async () => {
    const newQuestionComment = makeQuestionComment(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('questionComment-1'),
    )

    await inMemoryQuestionCommentsRepository.create(newQuestionComment)

    await sut.execute({
      authorId: 'author-1',
      questionCommentId: newQuestionComment.id.toString(),
    })

    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a question comment from another user', async () => {
    const newQuestionComment = makeQuestionComment(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('questionComment-1'),
    )

    await inMemoryQuestionCommentsRepository.create(newQuestionComment)

    const result = await sut.execute({
      questionCommentId: newQuestionComment.id.toString(),
      authorId: 'author-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
