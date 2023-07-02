import { Either, left, right } from '@/core/either'
import { QuestionsRepository } from '../repositories/questionsRepository'
import { ResourceNotFoundError } from './errors/resource-not-fount-error'
import { NotAllowedError } from './errors/not-allowed-error'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { QuestionAttachmentsRepository } from '../repositories/questionAttachmentsRepository'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'

interface EditQuestionUseCaseRequest {
  questionId: string
  authorId: string
  title: string
  attachmentIds: string[]
  content: string
}

type EditQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>

export class EditQuestionUseCase {
  constructor(
    private questionRepository: QuestionsRepository,
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) { }

  async execute({
    questionId,
    authorId,
    title,
    content,
    attachmentIds,
  }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
    const question = await this.questionRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError())
    }

    const attachmenList =
      await this.questionAttachmentsRepository.findManyByQuestionId(questionId)

    const questionAttachmentList = new QuestionAttachmentList(attachmenList)

    const newAttachmentsList = attachmentIds.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        questionId: question.id,
      })
    })

    questionAttachmentList.update(newAttachmentsList)

    question.attachments = questionAttachmentList
    question.title = title
    question.content = content

    await this.questionRepository.save(question)

    return right({})
  }
}
