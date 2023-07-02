import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { AnswerAttachmentList } from './answer-attachment-list'

export interface AnswerProps {
  authorId: UniqueEntityId
  questionId: UniqueEntityId
  attachments: AnswerAttachmentList
  content: string
  updateAt?: Date
  createAt: Date
}

export class Answer extends Entity<AnswerProps> {
  get attachments() {
    return this.props.attachments
  }

  get content() {
    return this.props.content
  }

  get authorId() {
    return this.props.authorId
  }

  get questionId() {
    return this.props.questionId
  }

  get updateAt() {
    return this.props.updateAt
  }

  get createAt() {
    return this.props.createAt
  }

  get excerpt() {
    return this.content.substring(0, 120).trimEnd().concat('...')
  }

  private touch() {
    this.props.updateAt = new Date()
  }

  set attachments(attachments: AnswerAttachmentList) {
    this.props.attachments = attachments
    this.touch()
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  static create(
    props: Optional<AnswerProps, 'createAt' | 'attachments'>,
    id?: UniqueEntityId,
  ) {
    const answer = new Answer(
      {
        attachments: props.attachments ?? new AnswerAttachmentList(),
        createAt: new Date(),
        ...props,
      },
      id,
    )

    return answer
  }
}
