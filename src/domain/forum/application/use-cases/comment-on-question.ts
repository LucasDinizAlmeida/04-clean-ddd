import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { QuestionComment } from '../../enterprise/entities/question-comment'
import { QuestionCommentsRepository } from '../repositories/questionCommentsRepository'
import { QuestionsRepository } from '../repositories/questionsRepository'
import { ResourceNotFoundError } from './errors/resource-not-fount-error'
import { Either, left, right } from '@/core/either'

interface CommentOnQuestionRequest {
  authorId: string
  questionId: string
  content: string
}

type CommentOnQuestionResponse = Either<
  ResourceNotFoundError,
  {
    questionComment: QuestionComment
  }
>

export class CommentOnQuestion {
  constructor(
    private questionRepository: QuestionsRepository,
    private questionCommentsRepository: QuestionCommentsRepository,
  ) { }

  async execute({
    questionId,
    authorId,
    content,
  }: CommentOnQuestionRequest): Promise<CommentOnQuestionResponse> {
    const question = await this.questionRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    // if (authorId !== question.authorId.toString()) {
    //   throw new Error('Not allowed!')
    // }

    const questionComment = QuestionComment.create({
      authorId: new UniqueEntityId(authorId),
      questionId: new UniqueEntityId(questionId),
      content,
    })

    await this.questionCommentsRepository.create(questionComment)

    return right({
      questionComment,
    })
  }
}
