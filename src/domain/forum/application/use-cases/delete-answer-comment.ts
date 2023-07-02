import { Either, left, right } from '@/core/either'
import { AnswerCommentsRepository } from '../repositories/answerCommentsRepository'
import { ResourceNotFoundError } from './errors/resource-not-fount-error'
import { NotAllowedError } from './errors/not-allowed-error'

interface DeleteAnswerCommentUseCaseRequest {
  answerCommentId: string
  authorId: string
}

type DeleteAnswerCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>

export class DeleteAnswerCommentUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) { }

  async execute({
    authorId,
    answerCommentId,
  }: DeleteAnswerCommentUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {
    const answerComment = await this.answerCommentsRepository.findById(
      answerCommentId,
    )

    if (!answerComment) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== answerComment.authorId.toString()) {
      return left(new NotAllowedError())
    }

    await this.answerCommentsRepository.delete(answerComment)

    return right({})
  }
}
