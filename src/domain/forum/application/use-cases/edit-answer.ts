import { Either, left, right } from '@/core/either'
import { AnswersRepository } from '../repositories/answersRepository'
import { ResourceNotFoundError } from './errors/resource-not-fount-error'
import { NotAllowedError } from './errors/not-allowed-error'
import { AnswerAttachmensRepository } from '../repositories/answerAttachmentsRepository'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'

interface EditAnswerUseCaseRequest {
  answerId: string
  authorId: string
  attachmentIds: string[]
  content: string
}

type EditAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>

export class EditAnswerUseCase {
  constructor(
    private answerRepository: AnswersRepository,
    private answerAttachmentsRepository: AnswerAttachmensRepository,
  ) { }

  async execute({
    answerId,
    authorId,
    content,
    attachmentIds,
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== answer.authorId.toString()) {
      return left(new NotAllowedError())
    }

    const attachmenList =
      await this.answerAttachmentsRepository.findManyByAnswerId(answerId)

    const answerAttachmentList = new AnswerAttachmentList(attachmenList)

    const newAttachmentsList = attachmentIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        answerId: answer.id,
      })
    })

    answerAttachmentList.update(newAttachmentsList)

    answer.attachments = answerAttachmentList
    answer.content = content

    await this.answerRepository.save(answer)

    return right({})
  }
}
