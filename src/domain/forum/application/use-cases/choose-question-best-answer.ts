import { Either, left, right } from '@/core/either'
import { Question } from '../../enterprise/entities/question'
import { AnswersRepository } from '../repositories/answersRepository'
import { QuestionsRepository } from '../repositories/questionsRepository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from './errors/resource-not-fount-error'
import { NotAllowedError } from './errors/not-allowed-error'

interface ChooseQuestionBestAnswerRequest {
  authorId: string
  answerId: string
}

type ChooseQuestionBestAnswerResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question
  }
>

export class ChooseQuestionBestAnswer {
  constructor(
    private questionsRepository: QuestionsRepository,
    private answersRepository: AnswersRepository,
  ) { }

  async execute({
    answerId,
    authorId,
  }: ChooseQuestionBestAnswerRequest): Promise<ChooseQuestionBestAnswerResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      throw new Error('Answer not found!')
    }

    const question = await this.questionsRepository.findById(
      answer.questionId.toString(),
    )

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError())
    }

    question.bestAnswerId = new UniqueEntityId(answer.id.toString())

    await this.questionsRepository.save(question)

    return right({
      question,
    })
  }
}
