import { expect, describe, beforeEach, it } from 'vitest'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { CommentOnAnswer } from './comment-on-answer'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'

let inMemoryAnswerRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachementsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswerCommentRepository: InMemoryAnswerCommentsRepository
let sut: CommentOnAnswer

describe('Comment on Answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachementsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentsRepository()
    inMemoryAnswerRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachementsRepository,
    )
    sut = new CommentOnAnswer(
      inMemoryAnswerRepository,
      inMemoryAnswerCommentRepository,
    )
  })

  it('should be able to comment on answer', async () => {
    const answer = makeAnswer()

    await inMemoryAnswerRepository.create(answer)

    await sut.execute({
      authorId: answer.authorId.toString(),
      answerId: answer.id.toString(),
      content: 'Comentário da resposta',
    })
    // console.log(inMemoryAnswerRepository.items[0].bestAnswerId)

    expect(inMemoryAnswerCommentRepository.items[0].content).toEqual(
      'Comentário da resposta',
    )
  })
})
