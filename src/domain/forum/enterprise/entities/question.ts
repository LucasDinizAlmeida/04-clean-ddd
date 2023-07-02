import dayjs from 'dayjs'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Slug } from './value-objects/slug'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { QuestionAttachmentList } from './question-attachment-list'

export interface QuestionProps {
  title: string
  bestAnswerId?: UniqueEntityId
  slug: Slug
  content: string
  attachments: QuestionAttachmentList
  authorId: UniqueEntityId
  createAt: Date
  updateAt?: Date
}

export class Question extends AggregateRoot<QuestionProps> {
  get title() {
    return this.props.title
  }

  get content() {
    return this.props.content
  }

  get attachments() {
    return this.props.attachments
  }

  get slug() {
    return this.props.slug
  }

  get authorId() {
    return this.props.authorId
  }

  get updateAt() {
    return this.props.updateAt
  }

  get createAt() {
    return this.props.createAt
  }

  get isNew(): boolean {
    return dayjs().diff(this.props.createAt, 'days') <= 3
  }

  get excerpt() {
    return this.content.substring(0, 120).trimEnd().concat('...')
  }

  private touch() {
    this.props.updateAt = new Date()
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  set attachments(attachments: QuestionAttachmentList) {
    this.props.attachments = attachments
    this.touch()
  }

  set title(title: string) {
    this.props.title = title
    this.props.slug = Slug.createFromText(title)
    this.touch()
  }

  set bestAnswerId(bestAnswerId: UniqueEntityId) {
    this.props.bestAnswerId = bestAnswerId
  }

  static create(
    props: Optional<QuestionProps, 'createAt' | 'slug' | 'attachments'>,
    id?: UniqueEntityId,
  ) {
    const question = new Question(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title),
        createAt: props.createAt ?? new Date(),
        attachments: props.attachments ?? new QuestionAttachmentList(),
      },
      id,
    )

    return question
  }
}

// Question.create({})
