import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface CommentProps {
  authorId: UniqueEntityId
  content: string
  createAt: Date
  updateAt?: Date
}

export abstract class Comment<
  Props extends CommentProps,
> extends Entity<Props> {
  get content() {
    return this.props.content
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

  private touch() {
    this.props.updateAt = new Date()
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  // static create(
  //   props: Optional<CommentProps, 'createAt'>,
  //   id?: UniqueEntityId,
  // ) {
  //   const answer = new Comment(
  //     {
  //       ...props,
  //       createAt: new Date(),
  //     },
  //     id,
  //   )

  //   return answer
  // }
}
